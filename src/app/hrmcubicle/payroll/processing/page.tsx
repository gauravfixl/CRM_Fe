"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import {
    CheckCircle2,
    AlertCircle,
    Users,
    FileText,
    ChevronRight,
    Search,
    Filter,
    Plus,
    X,
    Lock,
    Calculator,
    Zap,
    Scale,
    History,
    ShieldCheck,
    Activity,
    TrendingUp,
    Wallet,
    Download,
    Edit,
    Trash2,
    MoreHorizontal,
    UserPlus,
    ChevronDown,
    RotateCcw,
    Check,
    EyeOff,
    Eye,
    TrendingDown,
    PauseCircle,
    PlayCircle,
    Copy,
    Sliders,
    CalendarDays,
    GitBranch,
    CircleUser,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
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
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { usePayrollStore, calculateEmployeeNet, type PayrollEmployee, type ApprovalStage, type ApprovalStep } from "@/shared/data/payroll-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const DEPARTMENTS = [
    "Engineering",
    "Product",
    "Sales",
    "HR",
    "Design",
    "Marketing",
    "Operations",
    "Finance",
    "Legal",
    "Customer Success",
]

const STEPS = [
    { id: 0, title: "Inputs", desc: "Attendance & overrides", icon: Calculator, color: "#8B5CF6" },
    { id: 1, title: "Review", desc: "Verify variance", icon: Scale, color: "#EC4899" },
    { id: 2, title: "Approval", desc: "Lock & approve", icon: ShieldCheck, color: "#F59E0B" },
    { id: 3, title: "Paid", desc: "Disbursed", icon: Zap, color: "#10B981" },
]

const emptyEmployeeForm: Omit<PayrollEmployee, "id" | "payRunId"> = {
    empCode: "",
    name: "",
    dept: "Engineering",
    designation: "",
    email: "",
    bankAccount: "",
    ifsc: "",
    basic: 0,
    hra: 0,
    specialAllowance: 0,
    conveyance: 1600,
    medicalAllowance: 1250,
    variable: 0,
    lopDays: 0,
    otHours: 0,
    pf: 0,
    esi: 0,
    pt: 200,
    tds: 0,
    otherDeductions: 0,
    included: true,
    status: "Pending",
    approved: false,
    remarks: "",
}

const formatINR = (amt: number) => `₹${Math.round(amt).toLocaleString("en-IN")}`

const SalaryProcessingPage = () => {
    const {
        payRuns,
        addPayRun,
        advancePayRunStep,
        finalizePayRun,
        payrollEmployees,
        addPayrollEmployee,
        updatePayrollEmployee,
        deletePayrollEmployee,
        bulkUpdatePayrollEmployees,
        // Round 2
        holdEmployee,
        releaseEmployee,
        bulkHoldEmployees,
        advanceApprovalStage,
        rejectApprovalStage,
        clonePayRun,
        applyBulkAdjustment,
        applyProRata,
    } = usePayrollStore()
    const { toast } = useToast()

    // ── Active pay run selection ──────────────────────────
    const defaultActive = useMemo(
        () => payRuns.find((r) => r.status === "Draft" || r.status === "Processing") || payRuns[0],
        [payRuns]
    )
    const [activeRunId, setActiveRunId] = useState<string>(defaultActive?.id || "")

    useEffect(() => {
        if (!activeRunId && defaultActive) setActiveRunId(defaultActive.id)
    }, [defaultActive, activeRunId])

    const activeRun = payRuns.find((r) => r.id === activeRunId) || defaultActive
    const isFinalized = activeRun?.status === "Locked" || activeRun?.status === "Paid"
    const currentStep = activeRun?.step ?? 0

    // ── UI state ──────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("")
    const [filterDept, setFilterDept] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [filterApproval, setFilterApproval] = useState<string>("all")
    const [filterInclusion, setFilterInclusion] = useState<string>("all")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // ── Dialog / Sheet state ──────────────────────────────
    const [addEmployeeOpen, setAddEmployeeOpen] = useState(false)
    const [editSheetOpen, setEditSheetOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false)
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [newRunDialogOpen, setNewRunDialogOpen] = useState(false)

    const [editingEmployee, setEditingEmployee] = useState<PayrollEmployee | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
    const [newEmployeeForm, setNewEmployeeForm] = useState(emptyEmployeeForm)
    const [newRunMonth, setNewRunMonth] = useState("")

    // ─ Round 2 state ─
    const [holdDialogOpen, setHoldDialogOpen] = useState(false)
    const [holdReason, setHoldReason] = useState("")
    const [holdTargetIds, setHoldTargetIds] = useState<string[]>([])
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
    const [approvalTarget, setApprovalTarget] = useState<PayrollEmployee | null>(null)
    const [approvalRejectReason, setApprovalRejectReason] = useState("")
    const [approvalRejectStage, setApprovalRejectStage] = useState<ApprovalStage | null>(null)
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false)
    const [cloneSourceRunId, setCloneSourceRunId] = useState("")
    const [cloneTargetMonth, setCloneTargetMonth] = useState("")
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
    const [adjustField, setAdjustField] = useState<"variable" | "lopDays" | "otHours">("variable")
    const [adjustMode, setAdjustMode] = useState<"fixed" | "percent" | "delta">("delta")
    const [adjustValue, setAdjustValue] = useState<string>("0")
    const [proRataDialogOpen, setProRataDialogOpen] = useState(false)
    const [proRataTarget, setProRataTarget] = useState<PayrollEmployee | null>(null)
    const [proRataJoinDate, setProRataJoinDate] = useState("")
    const [proRataExitDate, setProRataExitDate] = useState("")

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Reset selections when active run changes
    useEffect(() => {
        setSelectedIds([])
    }, [activeRunId])

    // ── Derived data ──────────────────────────────────────
    const runEmployees = useMemo(
        () => payrollEmployees.filter((e) => e.payRunId === activeRun?.id),
        [payrollEmployees, activeRun?.id]
    )

    const filteredEmployees = useMemo(() => {
        return runEmployees.filter((e) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                const matches =
                    e.name.toLowerCase().includes(q) ||
                    e.empCode.toLowerCase().includes(q) ||
                    e.dept.toLowerCase().includes(q) ||
                    e.designation.toLowerCase().includes(q)
                if (!matches) return false
            }
            if (filterDept !== "all" && e.dept !== filterDept) return false
            if (filterStatus !== "all" && e.status !== filterStatus) return false
            if (filterApproval === "approved" && !e.approved) return false
            if (filterApproval === "pending" && e.approved) return false
            if (filterInclusion === "included" && !e.included) return false
            if (filterInclusion === "excluded" && e.included) return false
            return true
        })
    }, [runEmployees, searchQuery, filterDept, filterStatus, filterApproval, filterInclusion])

    const stats = useMemo(() => {
        const included = runEmployees.filter((e) => e.included)
        const approved = included.filter((e) => e.approved)
        const verified = runEmployees.filter((e) => e.status === "Verified")

        let totalPayout = 0
        let totalDeductions = 0
        let totalGross = 0
        included.forEach((e) => {
            const c = calculateEmployeeNet(e)
            totalPayout += c.netSalary
            totalDeductions += c.totalDeductions
            totalGross += c.grossEarnings
        })

        return {
            total: runEmployees.length,
            included: included.length,
            excluded: runEmployees.length - included.length,
            verified: verified.length,
            approved: approved.length,
            pendingApproval: included.length - approved.length,
            totalPayout,
            totalDeductions,
            totalGross,
            avgSalary: included.length ? totalPayout / included.length : 0,
        }
    }, [runEmployees])

    const hasActiveFilters =
        filterDept !== "all" ||
        filterStatus !== "all" ||
        filterApproval !== "all" ||
        filterInclusion !== "all"

    const clearFilters = () => {
        setFilterDept("all")
        setFilterStatus("all")
        setFilterApproval("all")
        setFilterInclusion("all")
        setSearchQuery("")
    }

    // ── Selection helpers ─────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visibleIds = filteredEmployees.map((e) => e.id)
        const allSelected = visibleIds.every((id) => selectedIds.includes(id))
        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)))
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
        }
    }

    // ── Action handlers ───────────────────────────────────
    const handleBulkApprove = () => {
        if (!selectedIds.length) return
        bulkUpdatePayrollEmployees(selectedIds, { approved: true, status: "Verified" })
        toast({
            title: "Bulk approval complete",
            description: `${selectedIds.length} employee${selectedIds.length > 1 ? "s" : ""} approved.`,
        })
        setSelectedIds([])
    }

    const handleBulkReject = () => {
        if (!selectedIds.length) return
        bulkUpdatePayrollEmployees(selectedIds, { approved: false, status: "Pending" })
        toast({
            title: "Bulk rejection complete",
            description: `${selectedIds.length} employee${selectedIds.length > 1 ? "s" : ""} sent back for review.`,
            variant: "destructive",
        })
        setSelectedIds([])
    }

    const handleBulkInclude = (include: boolean) => {
        if (!selectedIds.length) return
        bulkUpdatePayrollEmployees(selectedIds, { included: include })
        toast({
            title: include ? "Included in payroll" : "Excluded from payroll",
            description: `${selectedIds.length} employee${selectedIds.length > 1 ? "s" : ""} ${include ? "included" : "excluded"}.`,
        })
        setSelectedIds([])
    }

    // ─── Round 2 handlers ────────────────────────────────
    const openHoldDialog = (ids: string[]) => {
        setHoldTargetIds(ids)
        setHoldReason("")
        setHoldDialogOpen(true)
    }

    const handleConfirmHold = () => {
        if (!holdTargetIds.length || !holdReason.trim()) {
            toast({ title: "Reason required", variant: "destructive" })
            return
        }
        if (holdTargetIds.length === 1) {
            holdEmployee(holdTargetIds[0], holdReason)
        } else {
            bulkHoldEmployees(holdTargetIds, holdReason)
        }
        toast({
            title: `${holdTargetIds.length} employee${holdTargetIds.length > 1 ? "s" : ""} on hold`,
            description: "Excluded from payroll until released.",
        })
        setHoldDialogOpen(false)
        setHoldReason("")
        setHoldTargetIds([])
        setSelectedIds([])
    }

    const handleReleaseEmployee = (emp: PayrollEmployee) => {
        releaseEmployee(emp.id)
        toast({ title: "Released", description: `${emp.name} back in payroll.` })
    }

    const openApprovalDialog = (emp: PayrollEmployee) => {
        setApprovalTarget(emp)
        setApprovalRejectReason("")
        setApprovalRejectStage(null)
        setApprovalDialogOpen(true)
    }

    const handleAdvanceApproval = () => {
        if (!approvalTarget) return
        advanceApprovalStage(approvalTarget.id, "HR Admin")
        const updated = usePayrollStore.getState().payrollEmployees.find(e => e.id === approvalTarget.id)
        if (updated) setApprovalTarget(updated)
        toast({ title: "Stage approved", description: `${approvalTarget.name} advanced.` })
    }

    const handleRejectApproval = () => {
        if (!approvalTarget || !approvalRejectStage || !approvalRejectReason.trim()) {
            toast({ title: "Reason required", variant: "destructive" })
            return
        }
        rejectApprovalStage(approvalTarget.id, approvalRejectStage, "HR Admin", approvalRejectReason)
        toast({ title: "Stage rejected", description: approvalRejectReason, variant: "destructive" })
        setApprovalDialogOpen(false)
        setApprovalTarget(null)
        setApprovalRejectStage(null)
        setApprovalRejectReason("")
    }

    const openCloneDialog = () => {
        setCloneSourceRunId(activeRun?.id ?? "")
        setCloneTargetMonth("")
        setCloneDialogOpen(true)
    }

    const handleConfirmClone = () => {
        if (!cloneSourceRunId || !cloneTargetMonth.trim()) {
            toast({ title: "Missing data", description: "Pick source run and new month.", variant: "destructive" })
            return
        }
        const newRunId = clonePayRun(cloneSourceRunId, cloneTargetMonth.trim())
        if (!newRunId) {
            toast({ title: "Clone failed", description: "Duplicate month or source not found.", variant: "destructive" })
            return
        }
        const sourceCount = payrollEmployees.filter(e => e.payRunId === cloneSourceRunId).length
        toast({
            title: "Pay run cloned",
            description: `${sourceCount} employees copied to ${cloneTargetMonth}. Adjustments reset.`,
        })
        setCloneDialogOpen(false)
        setActiveRunId(newRunId)
    }

    const openAdjustDialog = () => {
        if (!selectedIds.length) {
            toast({ title: "Select employees first", variant: "destructive" })
            return
        }
        setAdjustField("variable")
        setAdjustMode("delta")
        setAdjustValue("0")
        setAdjustDialogOpen(true)
    }

    const handleConfirmAdjust = () => {
        const val = parseFloat(adjustValue) || 0
        applyBulkAdjustment(selectedIds, adjustField, adjustMode, val)
        const modeLabel = adjustMode === "fixed" ? "set to" : adjustMode === "percent" ? `changed by ${val}%` : `adjusted by ${val >= 0 ? "+" : ""}${val}`
        toast({
            title: `Bulk adjustment applied`,
            description: `${selectedIds.length} ${adjustField} ${modeLabel}.`,
        })
        setAdjustDialogOpen(false)
        setSelectedIds([])
    }

    const openProRataDialog = (emp: PayrollEmployee) => {
        setProRataTarget(emp)
        setProRataJoinDate(emp.joiningDate ?? "")
        setProRataExitDate(emp.exitDate ?? "")
        setProRataDialogOpen(true)
    }

    const handleConfirmProRata = () => {
        if (!proRataTarget) return
        if (!proRataJoinDate && !proRataExitDate) {
            toast({ title: "Date required", description: "Enter joining or exit date.", variant: "destructive" })
            return
        }
        // First update the join/exit dates on the employee
        updatePayrollEmployee(proRataTarget.id, {
            joiningDate: proRataJoinDate || undefined,
            exitDate: proRataExitDate || undefined,
        })
        // Then apply pro-rata
        applyProRata(proRataTarget.id)
        const updated = usePayrollStore.getState().payrollEmployees.find(e => e.id === proRataTarget.id)
        toast({
            title: "Pro-rata applied",
            description: updated ? `${proRataTarget.name}: ${updated.proratedDays} worked days.` : "Salary adjusted.",
        })
        setProRataDialogOpen(false)
        setProRataTarget(null)
    }

    const handleToggleApprove = (emp: PayrollEmployee) => {
        updatePayrollEmployee(emp.id, {
            approved: !emp.approved,
            status: !emp.approved ? "Verified" : "Pending",
        })
        toast({
            title: !emp.approved ? "Approved" : "Unapproved",
            description: `${emp.name} marked as ${!emp.approved ? "approved" : "pending"}.`,
        })
    }

    const handleToggleInclude = (emp: PayrollEmployee) => {
        updatePayrollEmployee(emp.id, { included: !emp.included })
        toast({
            title: !emp.included ? "Included" : "Excluded",
            description: `${emp.name} ${!emp.included ? "added to" : "removed from"} this cycle.`,
        })
    }

    const handleAddEmployee = () => {
        if (!newEmployeeForm.empCode.trim() || !newEmployeeForm.name.trim()) {
            toast({
                title: "Missing required fields",
                description: "Employee code and name are required.",
                variant: "destructive",
            })
            return
        }
        if (runEmployees.some((e) => e.empCode.toLowerCase() === newEmployeeForm.empCode.toLowerCase())) {
            toast({
                title: "Duplicate employee",
                description: `${newEmployeeForm.empCode} already exists in this cycle.`,
                variant: "destructive",
            })
            return
        }
        if (!activeRun) return
        addPayrollEmployee({ ...newEmployeeForm, payRunId: activeRun.id })
        toast({
            title: "Employee added",
            description: `${newEmployeeForm.name} added to ${activeRun.month}.`,
        })
        setNewEmployeeForm(emptyEmployeeForm)
        setAddEmployeeOpen(false)
    }

    const handleSaveEdit = () => {
        if (!editingEmployee) return
        updatePayrollEmployee(editingEmployee.id, editingEmployee)
        toast({
            title: "Saved",
            description: `${editingEmployee.name} updated successfully.`,
        })
        setEditSheetOpen(false)
        setEditingEmployee(null)
    }

    const handleConfirmDelete = () => {
        if (!deleteTargetId) return
        const emp = runEmployees.find((e) => e.id === deleteTargetId)
        deletePayrollEmployee(deleteTargetId)
        toast({
            title: "Employee removed",
            description: `${emp?.name ?? "Employee"} removed from this cycle.`,
            variant: "destructive",
        })
        setDeleteTargetId(null)
        setDeleteDialogOpen(false)
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId))
    }

    const handleAdvanceStep = () => {
        if (!activeRun) return
        if (currentStep === 0 && stats.verified < stats.included) {
            toast({
                title: "Cannot advance",
                description: `${stats.included - stats.verified} included employee${stats.included - stats.verified > 1 ? "s are" : " is"} not verified yet.`,
                variant: "destructive",
            })
            return
        }
        if (currentStep === 1 && stats.included === 0) {
            toast({
                title: "Cannot advance",
                description: "No employees are included in this cycle.",
                variant: "destructive",
            })
            return
        }
        if (currentStep === 2 && stats.approved < stats.included) {
            toast({
                title: "Cannot advance",
                description: `${stats.pendingApproval} employee${stats.pendingApproval > 1 ? "s" : ""} still pending approval.`,
                variant: "destructive",
            })
            return
        }
        advancePayRunStep(activeRun.id)
        const nextStepTitle = STEPS[Math.min(currentStep + 1, 3)].title
        toast({
            title: "Workflow advanced",
            description: `Moved to ${nextStepTitle} stage.`,
        })
    }

    const handleFinalize = () => {
        if (!activeRun) return
        if (stats.approved < stats.included) {
            toast({
                title: "Cannot finalize",
                description: `${stats.pendingApproval} employee${stats.pendingApproval > 1 ? "s" : ""} still pending approval.`,
                variant: "destructive",
            })
            return
        }
        if (stats.included === 0) {
            toast({
                title: "Cannot finalize",
                description: "No employees included in this cycle.",
                variant: "destructive",
            })
            return
        }
        finalizePayRun(activeRun.id)
        setFinalizeDialogOpen(false)
        toast({
            title: "Cycle finalized",
            description: `${activeRun.month} payroll has been locked. No further edits allowed.`,
        })
    }

    const handleCreateRun = () => {
        if (!newRunMonth.trim()) {
            toast({
                title: "Missing month",
                description: "Enter a month label (e.g. February 2026).",
                variant: "destructive",
            })
            return
        }
        if (payRuns.some((r) => r.month.toLowerCase() === newRunMonth.toLowerCase())) {
            toast({
                title: "Duplicate cycle",
                description: `A pay run for "${newRunMonth}" already exists.`,
                variant: "destructive",
            })
            return
        }
        addPayRun({
            month: newRunMonth.trim(),
            status: "Draft",
            totalNetPay: 0,
            totalDeductions: 0,
            totalTDS: 0,
            totalEmployees: 0,
            inclusionCount: 0,
            exclusionCount: 0,
            step: 0,
        })
        toast({
            title: "Pay run created",
            description: `Draft cycle for ${newRunMonth} is ready for input.`,
        })
        setNewRunMonth("")
        setNewRunDialogOpen(false)
    }

    // ── Auto-calc bonus (persists to store) ───────────────
    const handleAutoCalcBonus = () => {
        if (!runEmployees.length) {
            toast({ title: "No employees", description: "Add employees before auto-calculating." })
            return
        }
        runEmployees.forEach((e) => {
            const fixed = e.basic + e.hra + e.specialAllowance + e.conveyance + e.medicalAllowance
            updatePayrollEmployee(e.id, { variable: Math.round(fixed * 0.1) })
        })
        toast({
            title: "Bonus calculated",
            description: "Variable pay set to 10% of fixed earnings for all employees.",
        })
    }

    const handleBulkSync = () => {
        if (!runEmployees.length) {
            toast({ title: "Nothing to sync", description: "No employees in this cycle." })
            return
        }
        // Mark any Flagged/Pending as Verified when basic data exists
        runEmployees.forEach((e) => {
            if (e.basic > 0 && e.status !== "Verified") {
                updatePayrollEmployee(e.id, { status: "Verified" })
            }
        })
        toast({
            title: "Sync complete",
            description: `Attendance & earnings reconciled for ${runEmployees.length} employee${runEmployees.length > 1 ? "s" : ""}.`,
        })
    }

    // ── CSV Import ────────────────────────────────────────
    const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !activeRun) return

        const reader = new FileReader()
        reader.onload = (ev) => {
            const text = String(ev.target?.result ?? "")
            const lines = text.split(/\r?\n/).filter((l) => l.trim())
            if (lines.length < 2) {
                toast({
                    title: "Empty file",
                    description: "CSV must have a header row plus at least one data row.",
                    variant: "destructive",
                })
                return
            }
            const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
            const requiredCols = ["empcode", "name", "dept", "basic"]
            const missing = requiredCols.filter((c) => !headers.includes(c))
            if (missing.length) {
                toast({
                    title: "Missing columns",
                    description: `CSV must include: ${missing.join(", ")}.`,
                    variant: "destructive",
                })
                return
            }

            let added = 0
            let skipped = 0
            const existingCodes = new Set(runEmployees.map((r) => r.empCode.toLowerCase()))

            lines.slice(1).forEach((line) => {
                const cells = line.split(",").map((c) => c.trim())
                const row: Record<string, string> = {}
                headers.forEach((h, i) => (row[h] = cells[i] ?? ""))

                if (!row.empcode || !row.name || !row.basic) {
                    skipped++
                    return
                }
                if (existingCodes.has(row.empcode.toLowerCase())) {
                    skipped++
                    return
                }
                existingCodes.add(row.empcode.toLowerCase())

                const basic = parseFloat(row.basic) || 0
                addPayrollEmployee({
                    ...emptyEmployeeForm,
                    payRunId: activeRun.id,
                    empCode: row.empcode,
                    name: row.name,
                    dept: row.dept || "Engineering",
                    designation: row.designation || "",
                    email: row.email || "",
                    bankAccount: row.bankaccount || "",
                    ifsc: row.ifsc || "",
                    basic,
                    hra: parseFloat(row.hra) || Math.round(basic * 0.4),
                    specialAllowance: parseFloat(row.specialallowance) || 0,
                    conveyance: parseFloat(row.conveyance) || 1600,
                    medicalAllowance: parseFloat(row.medicalallowance) || 1250,
                    variable: parseFloat(row.variable) || 0,
                    lopDays: parseFloat(row.lopdays) || 0,
                    otHours: parseFloat(row.othours) || 0,
                    pf: parseFloat(row.pf) || Math.round(basic * 0.12),
                    esi: parseFloat(row.esi) || 0,
                    pt: parseFloat(row.pt) || 200,
                    tds: parseFloat(row.tds) || 0,
                    otherDeductions: parseFloat(row.otherdeductions) || 0,
                })
                added++
            })

            if (added) {
                toast({
                    title: "CSV imported",
                    description: `Added ${added} employee${added > 1 ? "s" : ""}${skipped ? `, skipped ${skipped}` : ""}.`,
                })
            } else {
                toast({
                    title: "Nothing imported",
                    description: `All ${skipped} rows were skipped (duplicates or invalid).`,
                    variant: "destructive",
                })
            }
        }
        reader.readAsText(file)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    // ── Exports ───────────────────────────────────────────
    const downloadFile = (content: string, filename: string, mime = "text/csv") => {
        const blob = new Blob([content], { type: mime })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleExport = (format: "csv" | "excel" | "bank") => {
        if (!runEmployees.length) {
            toast({ title: "No data", description: "Add employees before exporting.", variant: "destructive" })
            return
        }
        const monthSlug = activeRun?.month.replace(/\s+/g, "_") ?? "run"
        const today = new Date().toISOString().split("T")[0]

        if (format === "csv" || format === "excel") {
            const headers = [
                "Emp Code", "Name", "Department", "Designation",
                "Basic", "HRA", "Special Allowance", "Conveyance", "Medical Allowance",
                "Variable", "LOP Days", "OT Hours",
                "Gross Earnings", "PF", "ESI", "PT", "TDS", "Other Deductions", "Total Deductions",
                "Net Salary", "Status", "Approved", "Included",
            ]
            const rows = runEmployees.map((e) => {
                const c = calculateEmployeeNet(e)
                return [
                    e.empCode, `"${e.name}"`, e.dept, `"${e.designation}"`,
                    e.basic, e.hra, e.specialAllowance, e.conveyance, e.medicalAllowance,
                    e.variable, e.lopDays, e.otHours,
                    Math.round(c.grossEarnings), e.pf, e.esi, e.pt, e.tds, e.otherDeductions, Math.round(c.totalDeductions),
                    Math.round(c.netSalary), e.status, e.approved ? "Yes" : "No", e.included ? "Yes" : "No",
                ].join(",")
            })
            const csv = [headers.join(","), ...rows].join("\n")
            downloadFile(csv, `payroll_${monthSlug}_${today}.csv`)
            toast({ title: `${format === "excel" ? "Excel" : "CSV"} exported`, description: `${runEmployees.length} row${runEmployees.length > 1 ? "s" : ""} downloaded.` })
        }

        if (format === "bank") {
            const included = runEmployees.filter((e) => e.included && e.approved)
            if (!included.length) {
                toast({
                    title: "No disbursable employees",
                    description: "Include and approve employees before generating a bank file.",
                    variant: "destructive",
                })
                return
            }
            const headers = ["Emp Code", "Name", "Bank Account", "IFSC", "Net Amount (INR)", "Transfer Type"]
            const rows = included.map((e) => {
                const c = calculateEmployeeNet(e)
                const txnType = c.netSalary >= 200000 ? "RTGS" : "NEFT"
                return [
                    e.empCode,
                    `"${e.name}"`,
                    e.bankAccount || "NOT_PROVIDED",
                    e.ifsc || "NOT_PROVIDED",
                    Math.round(c.netSalary),
                    txnType,
                ].join(",")
            })
            const csv = [headers.join(","), ...rows].join("\n")
            downloadFile(csv, `bank_transfer_${monthSlug}_${today}.csv`)
            toast({
                title: "Bank file generated",
                description: `NEFT/RTGS file for ${included.length} employee${included.length > 1 ? "s" : ""} downloaded.`,
            })
        }
        setExportDialogOpen(false)
    }

    const handleExportAuditLog = () => {
        if (!runEmployees.length) {
            toast({ title: "No data", description: "Nothing to audit yet.", variant: "destructive" })
            return
        }
        const headers = ["Timestamp", "Employee", "Code", "Status", "Approved", "Included", "Net Salary"]
        const rows = runEmployees.map((e) => {
            const c = calculateEmployeeNet(e)
            return [
                new Date().toISOString(),
                `"${e.name}"`,
                e.empCode,
                e.status,
                e.approved ? "Yes" : "No",
                e.included ? "Yes" : "No",
                Math.round(c.netSalary),
            ].join(",")
        })
        const csv = [headers.join(","), ...rows].join("\n")
        const monthSlug = activeRun?.month.replace(/\s+/g, "_") ?? "run"
        const today = new Date().toISOString().split("T")[0]
        downloadFile(csv, `audit_log_${monthSlug}_${today}.csv`)
        toast({ title: "Audit log exported", description: `${runEmployees.length} record${runEmployees.length > 1 ? "s" : ""} captured.` })
    }

    if (!activeRun) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] p-8 font-sans">
                <div className="h-16 w-16 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center text-[#8B5CF6] mb-4">
                    <Activity size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No pay run yet</h2>
                <p className="text-sm text-slate-500 mb-6">Create your first payroll cycle to start processing.</p>
                <Button
                    onClick={() => setNewRunDialogOpen(true)}
                    className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs"
                >
                    <Plus size={14} className="mr-2" /> Create Pay Run
                </Button>
                <NewRunDialog
                    open={newRunDialogOpen}
                    onOpenChange={setNewRunDialogOpen}
                    value={newRunMonth}
                    onChange={setNewRunMonth}
                    onCreate={handleCreateRun}
                />
            </div>
        )
    }

    const runStatusColor =
        activeRun.status === "Draft"
            ? "bg-slate-100 text-slate-600"
            : activeRun.status === "Processing"
                ? "bg-blue-50 text-blue-600"
                : activeRun.status === "Approved"
                    ? "bg-amber-50 text-amber-600"
                    : activeRun.status === "Locked"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-emerald-100 text-emerald-700"

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* ── Header ─────────────────────────────── */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Activity size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Salary Processing</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-medium text-slate-500">Control center</span>
                                <span className="text-slate-300">•</span>
                                <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5", runStatusColor)}>
                                    {activeRun.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Pay run selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-700"
                                >
                                    <span className="truncate max-w-[140px]">{activeRun.month}</span>
                                    <ChevronDown size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <DropdownMenuLabel className="text-xs font-bold text-slate-500">Pay run cycles</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {payRuns.map((run) => (
                                    <DropdownMenuItem
                                        key={run.id}
                                        onClick={() => setActiveRunId(run.id)}
                                        className="flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-slate-800">{run.month}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {run.totalEmployees} employees • {formatINR(run.totalNetPay)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn("text-[9px] font-bold border-none px-2", run.status === "Draft" ? "bg-slate-100 text-slate-600" : run.status === "Paid" ? "bg-emerald-100 text-emerald-700" : run.status === "Locked" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                                                {run.status}
                                            </Badge>
                                            {run.id === activeRunId && <Check size={12} className="text-[#8B5CF6]" />}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setNewRunDialogOpen(true)}
                                    className="text-[#8B5CF6] font-semibold cursor-pointer"
                                >
                                    <Plus size={14} className="mr-2" /> Create new pay run
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="outline"
                            onClick={openCloneDialog}
                            disabled={isFinalized}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Copy size={14} /> <span className="hidden md:inline">Clone cycle</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExportAuditLog}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <History size={14} /> <span className="hidden md:inline">Audit log</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setExportDialogOpen(true)}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export</span>
                        </Button>

                        {!isFinalized && currentStep < 2 && (
                            <Button
                                onClick={handleAdvanceStep}
                                className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-sm border-none gap-1"
                            >
                                Next: {STEPS[currentStep + 1]?.title} <ChevronRight size={14} />
                            </Button>
                        )}
                        {!isFinalized && currentStep === 2 && (
                            <Button
                                onClick={() => setFinalizeDialogOpen(true)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-9 px-4 font-bold text-xs shadow-sm border-none gap-1"
                            >
                                <Lock size={14} /> Finalize cycle
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* ── Stepper ────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                            {STEPS.map((step, idx) => {
                                const isPast = currentStep > step.id || isFinalized
                                const isCurrent = !isFinalized && currentStep === step.id
                                const borderColor = isCurrent ? step.color : isPast ? "#10B981" : "#e2e8f0"
                                const bgLight = isCurrent ? `${step.color}14` : isPast ? "#10B98114" : "#ffffff"
                                return (
                                    <div key={step.id} className="relative">
                                        <Card
                                            className="rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
                                            style={{ borderColor, backgroundColor: bgLight, borderWidth: 1 }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div
                                                        className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm text-white"
                                                        style={{ backgroundColor: isCurrent ? step.color : isPast ? "#10B981" : "#e2e8f0" }}
                                                    >
                                                        {isPast ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                                                    </div>
                                                    <Badge
                                                        className="text-[9px] font-bold px-2 py-0.5 border-none text-white"
                                                        style={{ backgroundColor: isCurrent ? step.color : isPast ? "#10B981" : "#cbd5e1" }}
                                                    >
                                                        Step {step.id + 1}
                                                    </Badge>
                                                </div>
                                                <h4
                                                    className="text-sm font-bold tracking-tight"
                                                    style={{ color: isCurrent ? "#0f172a" : isPast ? "#047857" : "#94a3b8" }}
                                                >
                                                    {step.title}
                                                </h4>
                                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{step.desc}</p>
                                                {isCurrent && (
                                                    <div className="mt-3 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: step.color }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "70%" }}
                                                            transition={{ duration: 0.8 }}
                                                        />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                        {idx < STEPS.length - 1 && (
                                            <div
                                                className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 z-10"
                                                style={{ backgroundColor: isPast ? "#10B981" : "#e2e8f0" }}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── Stat cards ─────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            <StatCard
                                label="Total payout"
                                value={formatINR(stats.totalPayout)}
                                caption={`${stats.included} included`}
                                icon={Wallet}
                                color="#8B5CF6"
                            />
                            <StatCard
                                label="Gross earnings"
                                value={formatINR(stats.totalGross)}
                                caption="Before deductions"
                                icon={TrendingUp}
                                color="#0EA5E9"
                            />
                            <StatCard
                                label="Deductions"
                                value={formatINR(stats.totalDeductions)}
                                caption="PF + ESI + PT + TDS"
                                icon={TrendingDown}
                                color="#F59E0B"
                            />
                            <StatCard
                                label="Approved"
                                value={`${stats.approved}/${stats.included}`}
                                caption={stats.pendingApproval ? `${stats.pendingApproval} pending` : "All approved"}
                                icon={CheckCircle2}
                                color={stats.pendingApproval ? "#F43F5E" : "#10B981"}
                            />
                            <StatCard
                                label="Avg salary"
                                value={formatINR(stats.avgSalary)}
                                caption="Per included emp"
                                icon={Users}
                                color="#10B981"
                            />
                        </div>

                        {/* ── Main grid ──────────────────── */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            {/* Employee table */}
                            <div className="xl:col-span-9">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="space-y-0.5">
                                            <CardTitle className="text-base font-bold text-slate-900">Employee pay master</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500">
                                                {stats.total} total • {stats.included} included • {stats.approved} approved
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="relative flex-1 min-w-[200px] lg:w-64 lg:flex-none">
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
                                                        className={cn("h-9 rounded-lg font-semibold text-xs gap-2", hasActiveFilters ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5" : "border-slate-200 text-slate-600")}
                                                    >
                                                        <Filter size={14} />
                                                        Filters
                                                        {hasActiveFilters && (
                                                            <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold h-4 px-1.5">
                                                                {[filterDept, filterStatus, filterApproval, filterInclusion].filter((f) => f !== "all").length}
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="end" className="w-72 p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-bold text-slate-900">Filter employees</h4>
                                                        {hasActiveFilters && (
                                                            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs font-semibold text-rose-500 hover:text-rose-600 px-2">
                                                                <RotateCcw size={12} className="mr-1" /> Reset
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-semibold text-slate-600">Department</Label>
                                                        <Select value={filterDept} onValueChange={setFilterDept}>
                                                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All departments</SelectItem>
                                                                {Array.from(new Set(runEmployees.map((e) => e.dept))).map((d) => (
                                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-semibold text-slate-600">Verification</Label>
                                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All statuses</SelectItem>
                                                                <SelectItem value="Verified">Verified</SelectItem>
                                                                <SelectItem value="Pending">Pending</SelectItem>
                                                                <SelectItem value="Flagged">Flagged</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-semibold text-slate-600">Approval</Label>
                                                        <Select value={filterApproval} onValueChange={setFilterApproval}>
                                                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All</SelectItem>
                                                                <SelectItem value="approved">Approved only</SelectItem>
                                                                <SelectItem value="pending">Pending only</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-semibold text-slate-600">Inclusion</Label>
                                                        <Select value={filterInclusion} onValueChange={setFilterInclusion}>
                                                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All</SelectItem>
                                                                <SelectItem value="included">Included</SelectItem>
                                                                <SelectItem value="excluded">Excluded</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <Button
                                                disabled={isFinalized}
                                                onClick={() => {
                                                    setNewEmployeeForm(emptyEmployeeForm)
                                                    setAddEmployeeOpen(true)
                                                }}
                                                className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-semibold text-xs gap-2 border-none px-3"
                                            >
                                                <UserPlus size={14} /> Add employee
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0">
                                        {/* Bulk actions bar */}
                                        <AnimatePresence>
                                            {selectedIds.length > 0 && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-[#8B5CF6]/5 border-b border-[#8B5CF6]/10 px-6 py-3 flex flex-wrap items-center justify-between gap-2"
                                                >
                                                    <div className="flex items-center flex-wrap gap-2">
                                                        <span className="text-xs font-bold text-[#8B5CF6]">
                                                            {selectedIds.length} selected
                                                        </span>
                                                        <span className="h-4 w-px bg-slate-200 mx-1" />
                                                        <Button
                                                            size="sm"
                                                            onClick={handleBulkApprove}
                                                            disabled={isFinalized}
                                                            className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold px-3 rounded-md border-none"
                                                        >
                                                            <CheckCircle2 size={12} className="mr-1" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={handleBulkReject}
                                                            disabled={isFinalized}
                                                            className="h-7 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold px-3 rounded-md border-none"
                                                        >
                                                            <X size={12} className="mr-1" /> Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleBulkInclude(true)}
                                                            disabled={isFinalized}
                                                            variant="outline"
                                                            className="h-7 text-[11px] font-semibold px-3 rounded-md border-slate-200 text-slate-700"
                                                        >
                                                            <Eye size={12} className="mr-1" /> Include
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleBulkInclude(false)}
                                                            disabled={isFinalized}
                                                            variant="outline"
                                                            className="h-7 text-[11px] font-semibold px-3 rounded-md border-slate-200 text-slate-700"
                                                        >
                                                            <EyeOff size={12} className="mr-1" /> Exclude
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openHoldDialog(selectedIds)}
                                                            disabled={isFinalized}
                                                            variant="outline"
                                                            className="h-7 text-[11px] font-semibold px-3 rounded-md border-amber-200 text-amber-700 hover:bg-amber-50"
                                                        >
                                                            <PauseCircle size={12} className="mr-1" /> Hold
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={openAdjustDialog}
                                                            disabled={isFinalized}
                                                            variant="outline"
                                                            className="h-7 text-[11px] font-semibold px-3 rounded-md border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/5"
                                                        >
                                                            <Sliders size={12} className="mr-1" /> Adjust
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedIds([])}
                                                        className="h-7 text-[11px] font-semibold text-slate-500 hover:text-rose-500"
                                                    >
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
                                                                checked={
                                                                    filteredEmployees.length > 0 &&
                                                                    filteredEmployees.every((e) => selectedIds.includes(e.id))
                                                                }
                                                                onCheckedChange={toggleSelectAll}
                                                                disabled={isFinalized || filteredEmployees.length === 0}
                                                                className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                            />
                                                        </TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Fixed pay</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Variable</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">LOP / OT</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Net salary</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Included</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredEmployees.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={9} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                {runEmployees.length === 0
                                                                    ? "No employees in this cycle. Add one to get started."
                                                                    : "No employees match the current filters."}
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredEmployees.map((emp) => {
                                                            const calc = calculateEmployeeNet(emp)
                                                            const fixedTotal = emp.basic + emp.hra + emp.specialAllowance + emp.conveyance + emp.medicalAllowance
                                                            return (
                                                                <TableRow
                                                                    key={emp.id}
                                                                    className={cn("group border-slate-50", selectedIds.includes(emp.id) ? "bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10" : "hover:bg-slate-50/70", !emp.included && "opacity-60")}
                                                                >
                                                                    <TableCell className="pl-6 py-3">
                                                                        <Checkbox
                                                                            checked={selectedIds.includes(emp.id)}
                                                                            onCheckedChange={() => toggleSelect(emp.id)}
                                                                            disabled={isFinalized}
                                                                            className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                                {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                            </div>
                                                                            <div className="min-w-0">
                                                                                <div className="text-sm font-semibold text-slate-900 truncate">{emp.name}</div>
                                                                                <div className="text-[11px] font-medium text-slate-500 truncate">
                                                                                    {emp.empCode} • {emp.dept}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-sm font-semibold text-slate-800 tabular-nums">{formatINR(fixedTotal)}</TableCell>
                                                                    <TableCell className="py-3 text-sm font-semibold text-emerald-600 tabular-nums">
                                                                        {emp.variable > 0 ? `+${formatINR(emp.variable)}` : "—"}
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-xs font-medium tabular-nums">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={cn(emp.lopDays > 0 ? "text-rose-500 font-semibold" : "text-slate-400")}>
                                                                                LOP {emp.lopDays}d
                                                                            </span>
                                                                            <span className="text-slate-200">|</span>
                                                                            <span className={cn(emp.otHours > 0 ? "text-indigo-500 font-semibold" : "text-slate-400")}>
                                                                                OT {emp.otHours}h
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-sm font-bold text-slate-900 tabular-nums">{formatINR(calc.netSalary)}</TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Badge
                                                                                className={cn("border-none text-[10px] font-semibold px-2 py-0.5",
                                                                                    emp.status === "Verified" ? "bg-emerald-50 text-emerald-600" :
                                                                                        emp.status === "Flagged" ? "bg-rose-50 text-rose-600" :
                                                                                            "bg-amber-50 text-amber-600")}
                                                                            >
                                                                                {emp.status}
                                                                            </Badge>
                                                                            {emp.onHold && (
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] font-bold px-1.5 gap-0.5">
                                                                                            <PauseCircle size={10} /> HOLD
                                                                                        </Badge>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>On hold: {emp.holdReason}</TooltipContent>
                                                                                </Tooltip>
                                                                            )}
                                                                            {emp.isProrated && (
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[9px] font-bold px-1.5">
                                                                                            {emp.proratedDays}d
                                                                                        </Badge>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Pro-rated: {emp.proratedDays} days worked</TooltipContent>
                                                                                </Tooltip>
                                                                            )}
                                                                            {emp.approved && (
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Approved</TooltipContent>
                                                                                </Tooltip>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Switch
                                                                            checked={emp.included}
                                                                            disabled={isFinalized}
                                                                            onCheckedChange={() => handleToggleInclude(emp)}
                                                                            className="data-[state=checked]:bg-[#8B5CF6]"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100"
                                                                                >
                                                                                    <MoreHorizontal size={15} />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-48">
                                                                                <DropdownMenuItem
                                                                                    disabled={isFinalized}
                                                                                    onClick={() => {
                                                                                        setEditingEmployee(emp)
                                                                                        setEditSheetOpen(true)
                                                                                    }}
                                                                                    className="cursor-pointer text-xs font-medium"
                                                                                >
                                                                                    <Edit size={13} className="mr-2" /> Edit details
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    disabled={isFinalized}
                                                                                    onClick={() => handleToggleApprove(emp)}
                                                                                    className="cursor-pointer text-xs font-medium"
                                                                                >
                                                                                    {emp.approved ? (
                                                                                        <><X size={13} className="mr-2" /> Unapprove</>
                                                                                    ) : (
                                                                                        <><CheckCircle2 size={13} className="mr-2" /> Approve</>
                                                                                    )}
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    disabled={isFinalized}
                                                                                    onClick={() => handleToggleInclude(emp)}
                                                                                    className="cursor-pointer text-xs font-medium"
                                                                                >
                                                                                    {emp.included ? (
                                                                                        <><EyeOff size={13} className="mr-2" /> Exclude</>
                                                                                    ) : (
                                                                                        <><Eye size={13} className="mr-2" /> Include</>
                                                                                    )}
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                {/* ─ Round 2 actions ─ */}
                                                                                {emp.onHold ? (
                                                                                    <DropdownMenuItem
                                                                                        disabled={isFinalized}
                                                                                        onClick={() => handleReleaseEmployee(emp)}
                                                                                        className="cursor-pointer text-xs font-medium text-emerald-600 focus:text-emerald-600"
                                                                                    >
                                                                                        <PlayCircle size={13} className="mr-2" /> Release from hold
                                                                                    </DropdownMenuItem>
                                                                                ) : (
                                                                                    <DropdownMenuItem
                                                                                        disabled={isFinalized}
                                                                                        onClick={() => openHoldDialog([emp.id])}
                                                                                        className="cursor-pointer text-xs font-medium text-amber-600 focus:text-amber-600"
                                                                                    >
                                                                                        <PauseCircle size={13} className="mr-2" /> Put on hold
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                                <DropdownMenuItem
                                                                                    disabled={isFinalized}
                                                                                    onClick={() => openProRataDialog(emp)}
                                                                                    className="cursor-pointer text-xs font-medium"
                                                                                >
                                                                                    <CalendarDays size={13} className="mr-2" /> Apply pro-rata
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => openApprovalDialog(emp)}
                                                                                    className="cursor-pointer text-xs font-medium"
                                                                                >
                                                                                    <GitBranch size={13} className="mr-2" /> Approval chain
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem
                                                                                    disabled={isFinalized}
                                                                                    onClick={() => {
                                                                                        setDeleteTargetId(emp.id)
                                                                                        setDeleteDialogOpen(true)
                                                                                    }}
                                                                                    className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600"
                                                                                >
                                                                                    <Trash2 size={13} className="mr-2" /> Remove
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
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

                            {/* Control deck */}
                            <div className="xl:col-span-3 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 lg:p-5">
                                    <h4 className="text-sm font-bold text-slate-900 mb-4">Validation checks</h4>
                                    <div className="space-y-3">
                                        <ValidationRow
                                            label="Verified employees"
                                            value={`${stats.verified}/${stats.total}`}
                                            ok={stats.verified === stats.total && stats.total > 0}
                                        />
                                        <ValidationRow
                                            label="Approved employees"
                                            value={`${stats.approved}/${stats.included}`}
                                            ok={stats.approved === stats.included && stats.included > 0}
                                        />
                                        <ValidationRow
                                            label="Inclusion count"
                                            value={String(stats.included)}
                                            ok={stats.included > 0}
                                        />
                                        <ValidationRow
                                            label="Bank details present"
                                            value={`${runEmployees.filter((e) => e.included && e.bankAccount && e.ifsc).length}/${stats.included}`}
                                            ok={stats.included > 0 && runEmployees.filter((e) => e.included && e.bankAccount && e.ifsc).length === stats.included}
                                        />
                                        <Button
                                            onClick={handleBulkSync}
                                            disabled={isFinalized || runEmployees.length === 0}
                                            className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl font-semibold text-xs shadow-sm mt-4 border-none disabled:opacity-50"
                                        >
                                            <RotateCcw size={14} className="mr-2" /> Sync verification
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-4 lg:p-5 border-dashed">
                                    <h4 className="text-sm font-bold text-[#8B5CF6] mb-3">Quick actions</h4>
                                    <div className="space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv,text/csv"
                                            onChange={handleCsvImport}
                                            className="hidden"
                                        />
                                        <Button
                                            variant="outline"
                                            disabled={isFinalized}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-9 border-slate-200 bg-white rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50 justify-start"
                                        >
                                            <FileText size={14} className="mr-2" /> Import CSV
                                        </Button>
                                        <Button
                                            variant="outline"
                                            disabled={isFinalized}
                                            onClick={handleAutoCalcBonus}
                                            className="w-full h-9 border-slate-200 bg-white rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50 justify-start"
                                        >
                                            <Calculator size={14} className="mr-2" /> Auto-calc bonus (10%)
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleExport("bank")}
                                            className="w-full h-9 border-slate-200 bg-white rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50 justify-start"
                                        >
                                            <Wallet size={14} className="mr-2" /> Generate bank file
                                        </Button>
                                    </div>
                                </Card>

                                {isFinalized && (
                                    <Card className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 lg:p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                                <Lock size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-emerald-800">Cycle locked</h4>
                                                <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                                                    {activeRun.processedAt ? `Processed ${activeRun.processedAt}` : "No further edits allowed"}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {!isFinalized && stats.included === 0 && (
                                    <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
                                                No employees are currently included in this cycle. Include at least one employee to enable workflow advancement.
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Add Employee Dialog ─────────── */}
                <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <UserPlus size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Add employee to {activeRun.month}</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Fill in salary components. Values persist to the pay run and can be edited later.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <EmployeeForm value={newEmployeeForm} onChange={setNewEmployeeForm} />
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                            <Button variant="ghost" onClick={() => setAddEmployeeOpen(false)} className="h-10 px-5 font-semibold text-xs">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddEmployee}
                                className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs border-none"
                            >
                                Add employee
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Edit Sheet ─────────── */}
                <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
                    <SheetContent className="sm:max-w-lg p-0 overflow-hidden font-sans">
                        {editingEmployee && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-950 p-6 text-white space-y-1">
                                    <Badge className="bg-[#8B5CF6] text-white border-none font-semibold text-[10px] px-2 py-0.5 w-fit mb-2">
                                        Correction mode
                                    </Badge>
                                    <SheetTitle className="text-xl font-bold text-white tracking-tight">{editingEmployee.name}</SheetTitle>
                                    <SheetDescription className="text-slate-400 font-medium text-[11px]">
                                        {editingEmployee.empCode} • {editingEmployee.dept} • {editingEmployee.designation || "—"}
                                    </SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="flex-1 p-6">
                                    <EmployeeForm
                                        value={editingEmployee}
                                        onChange={(v) => setEditingEmployee({ ...editingEmployee, ...v })}
                                        showIdentity={false}
                                    />
                                    <div className="mt-6 space-y-2">
                                        <Label className="text-[11px] font-semibold text-slate-600">Remarks</Label>
                                        <Textarea
                                            value={editingEmployee.remarks ?? ""}
                                            onChange={(e) => setEditingEmployee({ ...editingEmployee, remarks: e.target.value })}
                                            placeholder="Optional notes about this record..."
                                            className="min-h-[80px] text-xs font-medium"
                                        />
                                    </div>
                                    <div className="mt-6 p-4 bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 rounded-xl border border-[#8B5CF6]/10">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Calculated net salary</div>
                                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                                            {formatINR(calculateEmployeeNet(editingEmployee).netSalary)}
                                        </div>
                                        <div className="text-[11px] font-medium text-slate-500 mt-1">
                                            Gross {formatINR(calculateEmployeeNet(editingEmployee).grossEarnings)} − Deductions {formatINR(calculateEmployeeNet(editingEmployee).totalDeductions)}
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                                    <Button
                                        onClick={handleSaveEdit}
                                        disabled={isFinalized}
                                        className="w-full h-11 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-sm border-none"
                                    >
                                        Save corrections
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setEditSheetOpen(false)
                                            setEditingEmployee(null)
                                        }}
                                        className="w-full h-10 text-slate-500 font-semibold text-xs hover:text-rose-500"
                                    >
                                        Discard changes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* ── Delete Confirmation ─────────── */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Remove employee?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will remove{" "}
                                <span className="font-bold text-slate-800">
                                    {runEmployees.find((e) => e.id === deleteTargetId)?.name ?? "this employee"}
                                </span>
                                {" "}from {activeRun.month}. Cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="h-10 font-semibold text-xs">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none"
                            >
                                Remove
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Finalize Dialog ─────────── */}
                <Dialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                                <Lock size={22} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Finalize payroll cycle?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will lock {activeRun.month}. No further edits allowed after this action.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                                <SummaryRow label="Total employees" value={String(stats.total)} />
                                <SummaryRow label="Included" value={String(stats.included)} color="text-emerald-600" />
                                <SummaryRow label="Approved" value={String(stats.approved)} color="text-emerald-600" />
                                <SummaryRow label="Total payout" value={formatINR(stats.totalPayout)} />
                                <SummaryRow label="Total deductions" value={formatINR(stats.totalDeductions)} color="text-amber-600" />
                            </div>
                            {stats.approved < stats.included && (
                                <div className="p-3 bg-rose-50 rounded-xl flex items-start gap-2 border border-rose-100">
                                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                    <p className="text-xs font-semibold text-rose-700">
                                        {stats.pendingApproval} employee{stats.pendingApproval > 1 ? "s are" : " is"} not approved yet.
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setFinalizeDialogOpen(false)} className="h-10 font-semibold text-xs">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleFinalize}
                                disabled={stats.approved < stats.included || stats.included === 0}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none disabled:opacity-50"
                            >
                                <Lock size={13} className="mr-1.5" /> Finalize & lock
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Export Dialog ─────────── */}
                <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <Download size={22} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Export payroll data</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Choose a format for {activeRun.month}. Files download immediately.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-2">
                            <ExportOption
                                title="CSV (full data)"
                                subtitle="All columns, comma-separated"
                                icon={FileText}
                                color="bg-blue-500 hover:bg-blue-600"
                                onClick={() => handleExport("csv")}
                            />
                            <ExportOption
                                title="Excel-ready CSV"
                                subtitle="Same as CSV, works with Excel"
                                icon={FileText}
                                color="bg-emerald-500 hover:bg-emerald-600"
                                onClick={() => handleExport("excel")}
                            />
                            <ExportOption
                                title="Bank transfer file"
                                subtitle="NEFT/RTGS format, approved only"
                                icon={Wallet}
                                color="bg-[#8B5CF6] hover:bg-[#7c4dff]"
                                onClick={() => handleExport("bank")}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── New Pay Run Dialog ─────────── */}
                <NewRunDialog
                    open={newRunDialogOpen}
                    onOpenChange={setNewRunDialogOpen}
                    value={newRunMonth}
                    onChange={setNewRunMonth}
                    onCreate={handleCreateRun}
                />

                {/* ──────────── Round 2 Dialogs ──────────── */}

                {/* ── Hold Dialog ─────────── */}
                <Dialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                                <PauseCircle size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Put {holdTargetIds.length > 1 ? `${holdTargetIds.length} employees` : "employee"} on hold
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Held employees are excluded from payroll until released. Reason gets logged.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <Label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Reason for hold</Label>
                            <Textarea
                                value={holdReason}
                                onChange={(e) => setHoldReason(e.target.value)}
                                placeholder="e.g. Salary correction pending, legal matter, document verification, etc."
                                className="min-h-[90px] text-xs font-medium"
                            />
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setHoldDialogOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmHold} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <PauseCircle size={13} className="mr-1.5" /> Confirm hold
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Clone Dialog ─────────── */}
                <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Copy size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Clone pay run</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Copies all employees from source → new Draft cycle. LOP, OT, variable and approvals reset.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Source pay run</Label>
                                <Select value={cloneSourceRunId} onValueChange={setCloneSourceRunId}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {payRuns.map((r) => {
                                            const empCount = payrollEmployees.filter(e => e.payRunId === r.id).length
                                            return (
                                                <SelectItem key={r.id} value={r.id}>
                                                    {r.month} • {empCount} employees • {r.status}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">New cycle label</Label>
                                <Input
                                    value={cloneTargetMonth}
                                    onChange={(e) => setCloneTargetMonth(e.target.value)}
                                    placeholder="e.g. May 2026"
                                    className="h-10 text-sm font-medium"
                                />
                                <p className="text-[10px] font-medium text-slate-400">Must be unique — existing months blocked.</p>
                            </div>
                            {cloneSourceRunId && (
                                <div className="p-3 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/10 text-xs font-medium text-slate-700">
                                    <div className="font-bold mb-1">Will copy:</div>
                                    <div>{payrollEmployees.filter(e => e.payRunId === cloneSourceRunId).length} employees</div>
                                    <div className="text-[11px] text-slate-500 mt-1">Identity + salary components preserved; LOP/OT/variable/approvals reset.</div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCloneDialogOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmClone} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <Copy size={13} className="mr-1.5" /> Clone now
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Adjust Dialog ─────────── */}
                <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Sliders size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Bulk adjustment</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Apply a uniform change to {selectedIds.length} employee{selectedIds.length > 1 ? "s" : ""}. Recomputes totals instantly.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">Field</Label>
                                    <Select value={adjustField} onValueChange={(v) => setAdjustField(v as any)}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="variable">Variable / Bonus (₹)</SelectItem>
                                            <SelectItem value="lopDays">LOP days</SelectItem>
                                            <SelectItem value="otHours">OT hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">Mode</Label>
                                    <Select value={adjustMode} onValueChange={(v) => setAdjustMode(v as any)}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Set fixed</SelectItem>
                                            <SelectItem value="delta">Add / subtract</SelectItem>
                                            <SelectItem value="percent">% change</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">
                                    Value {adjustMode === "percent" ? "(%)" : adjustField === "variable" ? "(₹)" : ""}
                                </Label>
                                <Input
                                    type="number"
                                    value={adjustValue}
                                    onChange={(e) => setAdjustValue(e.target.value)}
                                    className="h-10 text-sm font-semibold tabular-nums"
                                    placeholder={adjustMode === "delta" ? "Positive to add, negative to subtract" : ""}
                                />
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-medium text-slate-700">
                                {adjustMode === "fixed" && `Will set ${adjustField} to ${adjustValue} for all selected.`}
                                {adjustMode === "delta" && `Will ${parseFloat(adjustValue) >= 0 ? "add" : "subtract"} ${Math.abs(parseFloat(adjustValue) || 0)} to ${adjustField} of all selected.`}
                                {adjustMode === "percent" && `Will change ${adjustField} by ${adjustValue}% for all selected.`}
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setAdjustDialogOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmAdjust} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Apply adjustment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Pro-rata Dialog ─────────── */}
                <Dialog open={proRataDialogOpen} onOpenChange={setProRataDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <CalendarDays size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Pro-rata: {proRataTarget?.name}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                For mid-month joiners or leavers. Salary components scale by worked days / total days in month.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">Joining date</Label>
                                    <Input
                                        type="date"
                                        value={proRataJoinDate}
                                        onChange={(e) => setProRataJoinDate(e.target.value)}
                                        className="h-10 text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">Exit date (optional)</Label>
                                    <Input
                                        type="date"
                                        value={proRataExitDate}
                                        onChange={(e) => setProRataExitDate(e.target.value)}
                                        className="h-10 text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-[11px] font-medium text-blue-900">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={13} className="shrink-0 mt-0.5" />
                                    <div>
                                        Pro-rata will recompute <strong>Basic, HRA, Special, Conveyance, Medical</strong> based on (worked days / month days). Variable pay, deductions and OT are untouched.
                                    </div>
                                </div>
                            </div>
                            {proRataTarget?.isProrated && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-[11px] font-medium text-amber-800">
                                    <AlertCircle size={13} className="inline mr-1" />
                                    This employee is already pro-rated ({proRataTarget.proratedDays} days). Re-applying will overwrite.
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setProRataDialogOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmProRata} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <CalendarDays size={13} className="mr-1.5" /> Apply pro-rata
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Approval Chain Dialog ─────────── */}
                <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <GitBranch size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Approval chain — {approvalTarget?.name}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Multi-level approval flow: Manager → HR → Finance. Each stage must be approved sequentially.
                            </DialogDescription>
                        </DialogHeader>
                        {approvalTarget && (() => {
                            const defaultChain: ApprovalStep[] = [
                                { stage: 'Manager', status: 'Pending' },
                                { stage: 'HR', status: 'Pending' },
                                { stage: 'Finance', status: 'Pending' },
                            ]
                            const chain: ApprovalStep[] = approvalTarget.approvalChain ?? defaultChain
                            const nextPending = chain.find(s => s.status === "Pending")
                            const anyRejected = chain.some(s => s.status === "Rejected")
                            const allApproved = chain.every(s => s.status === "Approved")
                            return (
                                <div className="mt-4 space-y-3">
                                    <div className="space-y-2">
                                        {chain.map((step, idx) => (
                                            <div
                                                key={step.stage}
                                                className={cn("flex items-center gap-3 p-3 rounded-xl border",
                                                    step.status === "Approved" ? "bg-emerald-50 border-emerald-200" :
                                                        step.status === "Rejected" ? "bg-rose-50 border-rose-200" :
                                                            step.stage === nextPending?.stage ? "bg-amber-50 border-amber-200 ring-1 ring-amber-300" :
                                                                "bg-slate-50 border-slate-200")}
                                            >
                                                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                                                    step.status === "Approved" ? "bg-emerald-500 text-white" :
                                                        step.status === "Rejected" ? "bg-rose-500 text-white" :
                                                            step.stage === nextPending?.stage ? "bg-amber-500 text-white" :
                                                                "bg-slate-300 text-white")}>
                                                    {step.status === "Approved" ? <CheckCircle2 size={15} /> :
                                                        step.status === "Rejected" ? <X size={15} /> :
                                                            <CircleUser size={15} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">Stage {idx + 1}: {step.stage}</span>
                                                        <Badge className={cn("border-none text-[9px] font-bold",
                                                            step.status === "Approved" ? "bg-emerald-500 text-white" :
                                                                step.status === "Rejected" ? "bg-rose-500 text-white" :
                                                                    step.stage === nextPending?.stage ? "bg-amber-500 text-white" :
                                                                        "bg-slate-200 text-slate-700")}>
                                                            {step.status}
                                                        </Badge>
                                                    </div>
                                                    {step.approvedBy && step.status !== "Pending" && (
                                                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                                                            {step.status === "Approved" ? "Approved" : "Rejected"} by {step.approvedBy} on {step.approvedDate}
                                                        </div>
                                                    )}
                                                    {step.rejectionReason && (
                                                        <div className="text-[10px] font-semibold text-rose-700 mt-1">
                                                            Reason: {step.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                                {step.stage === nextPending?.stage && !approvalRejectStage && (
                                                    <div className="flex gap-1 shrink-0">
                                                        <Button
                                                            size="sm"
                                                            onClick={handleAdvanceApproval}
                                                            className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold px-3 border-none gap-1"
                                                        >
                                                            <ThumbsUp size={11} /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setApprovalRejectStage(step.stage)}
                                                            variant="outline"
                                                            className="h-8 text-rose-600 border-rose-300 text-[10px] font-semibold px-3 hover:bg-rose-50 gap-1"
                                                        >
                                                            <ThumbsDown size={11} /> Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {allApproved && (
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                            <span className="text-xs font-bold text-emerald-800">All stages approved — employee ready for disbursement.</span>
                                        </div>
                                    )}
                                    {anyRejected && (
                                        <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-center gap-2">
                                            <AlertCircle size={14} className="text-rose-600 shrink-0" />
                                            <span className="text-xs font-bold text-rose-800">Chain rejected. Fix issues and resubmit from scratch.</span>
                                        </div>
                                    )}
                                    {approvalRejectStage && (
                                        <div className="space-y-2 p-3 bg-rose-50 rounded-lg border border-rose-200">
                                            <Label className="text-[11px] font-semibold text-rose-700">Rejection reason for {approvalRejectStage}</Label>
                                            <Textarea
                                                value={approvalRejectReason}
                                                onChange={(e) => setApprovalRejectReason(e.target.value)}
                                                placeholder="Explain why this stage is being rejected..."
                                                className="min-h-[70px] text-xs font-medium bg-white"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => { setApprovalRejectStage(null); setApprovalRejectReason("") }}
                                                    className="h-8 text-[11px] font-semibold flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleRejectApproval}
                                                    className="h-8 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold px-3 border-none flex-1"
                                                >
                                                    Confirm reject
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })()}
                        <DialogFooter className="mt-4">
                            <Button variant="ghost" onClick={() => setApprovalDialogOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
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
                <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}14`, color }}
                >
                    <Icon size={18} />
                </div>
            </div>
        </CardContent>
    </Card>
)

const ValidationRow = ({ label, value, ok }: { label: string; value: string; ok: boolean }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <div className="flex items-center gap-1.5">
            <span className={cn("text-xs font-bold tabular-nums", ok ? "text-emerald-600" : "text-amber-600")}>{value}</span>
            {ok ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
        </div>
    </div>
)

const SummaryRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className={cn("font-bold tabular-nums", color ?? "text-slate-900")}>{value}</span>
    </div>
)

const ExportOption = ({ title, subtitle, icon: Icon, color, onClick }: { title: string; subtitle: string; icon: any; color: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn("w-full h-14 text-white rounded-xl font-semibold text-xs flex items-center gap-3 px-4 transition-all border-none text-left", color)}
    >
        <Icon size={18} className="shrink-0" />
        <div>
            <div className="text-sm font-bold leading-tight">{title}</div>
            <div className="text-[11px] font-medium opacity-85">{subtitle}</div>
        </div>
    </button>
)

const NewRunDialog = ({ open, onOpenChange, value, onChange, onCreate }: { open: boolean; onOpenChange: (v: boolean) => void; value: string; onChange: (v: string) => void; onCreate: () => void }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
            <DialogHeader className="space-y-1">
                <div className="h-11 w-11 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                    <Plus size={22} />
                </div>
                <DialogTitle className="text-lg font-bold text-slate-900">Create new pay run</DialogTitle>
                <DialogDescription className="text-xs font-medium text-slate-500">
                    Starts a fresh cycle in Draft status with no employees yet.
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-2">
                <Label className="text-[11px] font-semibold text-slate-600">Cycle label</Label>
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. February 2026"
                    className="h-11 text-sm font-medium"
                    autoFocus
                />
                <p className="text-[11px] font-medium text-slate-400">
                    Use a unique label. Existing cycles cannot be duplicated.
                </p>
            </div>
            <DialogFooter className="mt-4 gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-10 font-semibold text-xs">
                    Cancel
                </Button>
                <Button
                    onClick={onCreate}
                    className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none"
                >
                    Create pay run
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const EmployeeForm = ({ value, onChange, showIdentity = true }: { value: any; onChange: (v: any) => void; showIdentity?: boolean }) => {
    const set = (key: string, v: any) => onChange({ ...value, [key]: v })
    return (
        <div className="space-y-5">
            {showIdentity && (
                <section className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identity</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Employee code" required>
                            <Input value={value.empCode} onChange={(e) => set("empCode", e.target.value)} placeholder="EMP001" className="h-10 text-sm font-medium" />
                        </FormField>
                        <FormField label="Full name" required>
                            <Input value={value.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" className="h-10 text-sm font-medium" />
                        </FormField>
                        <FormField label="Department">
                            <Select value={value.dept} onValueChange={(v) => set("dept", v)}>
                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Designation">
                            <Input value={value.designation} onChange={(e) => set("designation", e.target.value)} placeholder="Engineer" className="h-10 text-sm font-medium" />
                        </FormField>
                        <FormField label="Email">
                            <Input type="email" value={value.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="jane@fixl.com" className="h-10 text-sm font-medium" />
                        </FormField>
                        <FormField label="Status">
                            <Select value={value.status} onValueChange={(v) => set("status", v)}>
                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Verified">Verified</SelectItem>
                                    <SelectItem value="Flagged">Flagged</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Bank account">
                            <Input value={value.bankAccount ?? ""} onChange={(e) => set("bankAccount", e.target.value)} placeholder="XXXXXXXX1234" className="h-10 text-sm font-medium" />
                        </FormField>
                        <FormField label="IFSC">
                            <Input value={value.ifsc ?? ""} onChange={(e) => set("ifsc", e.target.value)} placeholder="HDFC0001234" className="h-10 text-sm font-medium" />
                        </FormField>
                    </div>
                </section>
            )}

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earnings (monthly)</h4>
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Basic pay">
                        <Input type="number" value={value.basic} onChange={(e) => set("basic", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="HRA">
                        <Input type="number" value={value.hra} onChange={(e) => set("hra", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Special allowance">
                        <Input type="number" value={value.specialAllowance} onChange={(e) => set("specialAllowance", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Conveyance">
                        <Input type="number" value={value.conveyance} onChange={(e) => set("conveyance", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Medical allowance">
                        <Input type="number" value={value.medicalAllowance} onChange={(e) => set("medicalAllowance", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Variable / Bonus">
                        <Input type="number" value={value.variable} onChange={(e) => set("variable", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                </div>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance adjustments</h4>
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="LOP days">
                        <Input type="number" value={value.lopDays} onChange={(e) => set("lopDays", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="OT hours">
                        <Input type="number" value={value.otHours} onChange={(e) => set("otHours", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                </div>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deductions (monthly)</h4>
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="PF (Employee)">
                        <Input type="number" value={value.pf} onChange={(e) => set("pf", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="ESI">
                        <Input type="number" value={value.esi} onChange={(e) => set("esi", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Professional tax">
                        <Input type="number" value={value.pt} onChange={(e) => set("pt", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="TDS">
                        <Input type="number" value={value.tds} onChange={(e) => set("tds", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Other deductions">
                        <Input type="number" value={value.otherDeductions} onChange={(e) => set("otherDeductions", parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Include in payroll">
                        <div className="h-10 flex items-center">
                            <Switch
                                checked={value.included}
                                onCheckedChange={(v) => set("included", v)}
                                className="data-[state=checked]:bg-[#8B5CF6]"
                            />
                            <span className="ml-2 text-xs font-medium text-slate-600">
                                {value.included ? "Included" : "Excluded"}
                            </span>
                        </div>
                    </FormField>
                </div>
            </section>
        </div>
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

export default SalaryProcessingPage
