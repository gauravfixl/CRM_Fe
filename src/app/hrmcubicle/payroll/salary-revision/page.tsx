"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import {
    TrendingUp,
    Plus,
    Search,
    Edit,
    Trash2,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    Percent,
    Eye,
    ArrowUpRight,
    Filter,
    MoreHorizontal,
    RotateCcw,
    Banknote,
    MessageSquare,
    Send,
    AlertCircle,
    Calculator,
    Calendar,
    Users,
    Upload,
    FileCheck,
    FileText,
    GitBranch,
    UserCheck,
    UserX,
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
import { useSalaryStore, type SalaryRevision, type RevisionApprovalStep, type RevisionLetter } from "@/shared/data/salary-store"
import { usePayrollStore } from "@/shared/data/payroll-store"
import { getAllAppraisals, getAllEmployees } from "@/modules/hrm/hooks/hrmHooks"
import { motion, AnimatePresence } from "framer-motion"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const DEPARTMENTS = ["Engineering", "Product", "Sales", "Marketing", "Operations", "HR", "Finance", "Design", "Legal", "Customer Success"]

const REVISION_TYPES: SalaryRevision["revisionType"][] = [
    "Annual Appraisal",
    "Promotion",
    "Market Correction",
    "Retention Bonus",
    "Mid-year Adjustment",
]

const emptyForm: Omit<SalaryRevision, "id" | "incrementPercent"> = {
    empCode: "",
    employeeId: "",
    employeeName: "",
    department: "Engineering",
    designation: "",
    currentCTC: 0,
    revisedCTC: 0,
    revisionType: "Annual Appraisal",
    effectiveDate: new Date().toISOString().split("T")[0],
    reason: "",
    status: "Pending",
    linkedAppraisalId: "",
    arrearsFromDate: "",
    arrearsAmount: 0,
    submittedDate: new Date().toISOString().split("T")[0],
    comments: [],
}

const SalaryRevisionPage = () => {
    const { toast } = useToast()
    const {
        revisions,
        addRevision,
        updateRevision,
        deleteRevision,
        approveRevision,
        rejectRevision,
        bulkApproveRevisions,
        bulkDeleteRevisions,
        addRevisionComment,
        advanceRevisionApproval,
        rejectRevisionStage,
        generateRevisionLetter,
        issueRevisionLetter,
        calculateArrears,
        bulkImportRevisions,
        getRevisionBudgetSummary,
        revisionLetters,
    } = useSalaryStore()

    // ─ Backend appraisals + employees (real data for linking) ─
    type BackendAppraisal = { _id: string; employeeId?: string | { _id: string; firstName?: string; lastName?: string; employeeCode?: string }; period?: string; overallRating?: number; status?: string; reviewDate?: string }
    type BackendEmployee = { _id: string; employeeCode?: string; firstName?: string; lastName?: string; departmentId?: { name?: string } | string }
    const [backendAppraisals, setBackendAppraisals] = useState<BackendAppraisal[]>([])
    const [backendEmployees, setBackendEmployees] = useState<BackendEmployee[]>([])
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const [apRes, empRes]: any = await Promise.allSettled([getAllAppraisals(), getAllEmployees()]).then((r) =>
                    r.map((x) => (x.status === "fulfilled" ? x.value : null))
                )
                const ap: BackendAppraisal[] = apRes?.data?.appraisals ?? apRes?.data?.data?.appraisals ?? apRes?.data ?? []
                const emps: BackendEmployee[] = empRes?.data?.employees ?? empRes?.data?.data?.employees ?? empRes?.data ?? []
                if (!cancelled) {
                    setBackendAppraisals(Array.isArray(ap) ? ap : [])
                    setBackendEmployees(Array.isArray(emps) ? emps : [])
                }
            } catch {
                // Silently ignore — fallback to manual input
            }
        })()
        return () => { cancelled = true }
    }, [])

    // ── UI state ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [deptFilter, setDeptFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Dialogs
    const [formOpen, setFormOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

    const [editingRevision, setEditingRevision] = useState<SalaryRevision | null>(null)
    const [viewingRevision, setViewingRevision] = useState<SalaryRevision | null>(null)
    const [rejectTargetId, setRejectTargetId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [commentText, setCommentText] = useState("")
    const [form, setForm] = useState(emptyForm)

    // ── Round 2 state ──────────────────────────────────────
    const [chainOpen, setChainOpen] = useState(false)
    const [chainTarget, setChainTarget] = useState<SalaryRevision | null>(null)
    const [chainRejectStage, setChainRejectStage] = useState<RevisionApprovalStep["stage"] | null>(null)
    const [chainRejectReason, setChainRejectReason] = useState("")
    const [chainApproveNote, setChainApproveNote] = useState("")

    const [letterGenOpen, setLetterGenOpen] = useState(false)
    const [letterGenTarget, setLetterGenTarget] = useState<SalaryRevision | null>(null)
    const [letterTemplate, setLetterTemplate] = useState<RevisionLetter["templateType"]>("Standard")
    const [generatedLetter, setGeneratedLetter] = useState<RevisionLetter | null>(null)

    const [letterViewOpen, setLetterViewOpen] = useState(false)
    const [viewingLetter, setViewingLetter] = useState<RevisionLetter | null>(null)

    const [arrearsOpen, setArrearsOpen] = useState(false)
    const [arrearsTarget, setArrearsTarget] = useState<SalaryRevision | null>(null)
    const [arrearsFrom, setArrearsFrom] = useState("")
    const [arrearsTo, setArrearsTo] = useState(new Date().toISOString().split("T")[0])

    const [budgetOpen, setBudgetOpen] = useState(false)
    const [budgetYear, setBudgetYear] = useState(String(new Date().getFullYear()))

    const [importOpen, setImportOpen] = useState(false)
    const [importRows, setImportRows] = useState<{ row: Omit<SalaryRevision, "id">; ok: boolean; reason?: string }[]>([])
    const importFileInputRef = useRef<HTMLInputElement | null>(null)

    // ── Derived ────────────────────────────────────────────
    const incrementPercent = useMemo(() => {
        if (form.currentCTC <= 0) return 0
        return ((form.revisedCTC - form.currentCTC) / form.currentCTC) * 100
    }, [form.currentCTC, form.revisedCTC])

    const monthlyChange = useMemo(() => (form.revisedCTC - form.currentCTC) / 12, [form.currentCTC, form.revisedCTC])

    const suggestedArrears = useMemo(() => {
        if (!form.arrearsFromDate || form.revisedCTC <= form.currentCTC) return 0
        const start = new Date(form.arrearsFromDate)
        const today = new Date()
        const monthsDiff = Math.max(0, (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth()))
        return Math.round(monthlyChange * monthsDiff)
    }, [form.arrearsFromDate, form.revisedCTC, form.currentCTC, monthlyChange])

    const stats = useMemo(() => {
        const pending = revisions.filter((r) => r.status === "Pending").length
        const approved = revisions.filter((r) => r.status === "Approved").length
        const rejected = revisions.filter((r) => r.status === "Rejected").length
        const avgInc = revisions.length > 0
            ? (revisions.reduce((s, r) => s + r.incrementPercent, 0) / revisions.length).toFixed(1)
            : "0"
        const budgetImpact = revisions
            .filter((r) => r.status === "Approved")
            .reduce((s, r) => s + (r.revisedCTC - r.currentCTC), 0)
        const arrearsTotal = revisions
            .filter((r) => r.status === "Approved")
            .reduce((s, r) => s + (r.arrearsAmount ?? 0), 0)
        return { pending, approved, rejected, avgInc, budgetImpact, arrearsTotal }
    }, [revisions])

    const deptBudgets = useMemo(() => {
        const deptMap = new Map<string, { totalImpact: number; count: number }>()
        revisions.filter((r) => r.status === "Approved").forEach((r) => {
            const existing = deptMap.get(r.department) ?? { totalImpact: 0, count: 0 }
            existing.totalImpact += r.revisedCTC - r.currentCTC
            existing.count += 1
            deptMap.set(r.department, existing)
        })
        return Array.from(deptMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.totalImpact - a.totalImpact)
    }, [revisions])

    const maxDeptImpact = Math.max(1, ...deptBudgets.map((d) => d.totalImpact))

    const filteredRevisions = useMemo(() => {
        return revisions
            .filter((r) => {
                if (activeTab === "pending" && r.status !== "Pending") return false
                if (activeTab === "approved" && r.status !== "Approved") return false
                if (activeTab === "rejected" && r.status !== "Rejected") return false
                if (deptFilter !== "all" && r.department !== deptFilter) return false
                if (typeFilter !== "all" && r.revisionType !== typeFilter) return false
                if (searchTerm) {
                    const q = searchTerm.toLowerCase()
                    if (
                        !r.employeeName.toLowerCase().includes(q) &&
                        !r.employeeId.toLowerCase().includes(q) &&
                        !(r.empCode ?? "").toLowerCase().includes(q) &&
                        !r.department.toLowerCase().includes(q) &&
                        !(r.reason ?? "").toLowerCase().includes(q)
                    ) return false
                }
                return true
            })
    }, [revisions, activeTab, deptFilter, typeFilter, searchTerm])

    const hasActiveFilters = deptFilter !== "all" || typeFilter !== "all"
    const clearFilters = () => { setDeptFilter("all"); setTypeFilter("all"); setSearchTerm("") }

    // ── Selection ─────────────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visible = filteredRevisions.map((r) => r.id)
        const allSel = visible.every((id) => selectedIds.includes(id))
        if (allSel) setSelectedIds((prev) => prev.filter((id) => !visible.includes(id)))
        else setSelectedIds((prev) => Array.from(new Set([...prev, ...visible])))
    }

    // ── Handlers ──────────────────────────────────────────
    const openAddForm = () => {
        setEditingRevision(null)
        setForm(emptyForm)
        setFormOpen(true)
    }

    const openEditForm = (r: SalaryRevision) => {
        setEditingRevision(r)
        setForm({
            empCode: r.empCode ?? "",
            employeeId: r.employeeId,
            employeeName: r.employeeName,
            department: r.department,
            designation: r.designation ?? "",
            currentCTC: r.currentCTC,
            revisedCTC: r.revisedCTC,
            revisionType: r.revisionType ?? "Annual Appraisal",
            effectiveDate: r.effectiveDate,
            reason: r.reason,
            status: r.status,
            linkedAppraisalId: r.linkedAppraisalId ?? "",
            arrearsFromDate: r.arrearsFromDate ?? "",
            arrearsAmount: r.arrearsAmount ?? 0,
            submittedDate: r.submittedDate ?? new Date().toISOString().split("T")[0],
            comments: r.comments ?? [],
        })
        setFormOpen(true)
    }

    const handleSave = () => {
        if (!form.employeeName.trim() || form.currentCTC <= 0 || form.revisedCTC <= 0) {
            toast({ title: "Validation error", description: "Name, current CTC and proposed CTC are required.", variant: "destructive" })
            return
        }
        const payload: Omit<SalaryRevision, "id"> = {
            ...form,
            incrementPercent: Number(incrementPercent.toFixed(2)),
            submittedDate: form.submittedDate || new Date().toISOString().split("T")[0],
        }
        if (editingRevision) {
            updateRevision(editingRevision.id, payload)
            toast({ title: "Revision updated", description: `${form.employeeName}'s revision saved.` })
        } else {
            addRevision(payload)
            toast({ title: "Revision submitted", description: `${form.employeeName} submitted for approval.` })
        }
        setFormOpen(false)
        setEditingRevision(null)
        setForm(emptyForm)
    }

    const handleApprove = (r: SalaryRevision) => {
        approveRevision(r.id, "HR Head")
        // Cascade: apply revised CTC to any future-dated Draft/Processing pay runs for this employee
        usePayrollStore.getState().syncRevisionToNextPayRun(r.id)
        toast({ title: "Revision approved", description: `${r.employeeName} • +${r.incrementPercent}% · next pay run updated` })
    }

    const openRejectDialog = (id: string) => {
        setRejectTargetId(id)
        setRejectReason("")
        setRejectOpen(true)
    }

    const handleConfirmReject = () => {
        if (!rejectTargetId) return
        if (!rejectReason.trim()) {
            toast({ title: "Reason required", variant: "destructive" })
            return
        }
        rejectRevision(rejectTargetId, rejectReason)
        const r = revisions.find((x) => x.id === rejectTargetId)
        toast({ title: "Revision rejected", description: r?.employeeName ?? "", variant: "destructive" })
        setRejectOpen(false)
        setRejectReason("")
        setRejectTargetId(null)
    }

    const handleDelete = (id: string) => {
        const r = revisions.find((x) => x.id === id)
        deleteRevision(id)
        toast({ title: "Revision deleted", description: r?.employeeName ?? "", variant: "destructive" })
        setSelectedIds((prev) => prev.filter((i) => i !== id))
    }

    const handleBulkApprove = () => {
        if (!selectedIds.length) return
        const eligible = selectedIds.filter((id) => revisions.find((r) => r.id === id)?.status === "Pending")
        if (!eligible.length) {
            toast({ title: "Nothing to approve", description: "Only pending revisions can be approved.", variant: "destructive" })
            return
        }
        bulkApproveRevisions(eligible, "HR Head")
        // Cascade: apply each approved revision to any future-dated Draft/Processing pay runs
        const syncFn = usePayrollStore.getState().syncRevisionToNextPayRun
        eligible.forEach(id => syncFn(id))
        toast({ title: `Approved ${eligible.length}`, description: "Bulk approval complete · pay runs synced." })
        setSelectedIds([])
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        bulkDeleteRevisions(selectedIds)
        toast({ title: `Deleted ${selectedIds.length}`, variant: "destructive" })
        setSelectedIds([])
        setDeleteConfirmOpen(false)
    }

    const handleAddComment = () => {
        if (!viewingRevision || !commentText.trim()) return
        addRevisionComment(viewingRevision.id, "HR Manager", commentText.trim())
        toast({ title: "Comment added" })
        const updated = {
            ...viewingRevision,
            comments: [
                ...(viewingRevision.comments ?? []),
                { id: `rcm-${Date.now()}`, author: "HR Manager", text: commentText.trim(), timestamp: new Date().toISOString() },
            ],
        }
        setViewingRevision(updated)
        setCommentText("")
    }

    const handleExport = () => {
        if (!revisions.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const source = filteredRevisions.length ? filteredRevisions : revisions
        const headers = [
            "Employee", "Code", "Department", "Designation", "Type",
            "Current CTC", "Revised CTC", "Increment %", "Effective Date",
            "Status", "Approved By", "Reason", "Arrears Amount",
        ]
        const rows = source.map((r) => [
            `"${r.employeeName}"`,
            r.empCode ?? r.employeeId,
            r.department,
            r.designation ?? "",
            r.revisionType ?? "",
            r.currentCTC,
            r.revisedCTC,
            r.incrementPercent,
            r.effectiveDate,
            r.status,
            r.approvedBy ?? "",
            `"${(r.reason ?? "").replace(/"/g, "'")}"`,
            r.arrearsAmount ?? 0,
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `salary_revisions_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${source.length} revisions downloaded.` })
    }

    // ── Round 2 derived/handlers ──────────────────────────
    const openChainDialog = (r: SalaryRevision) => {
        setChainTarget(r)
        setChainRejectStage(null)
        setChainRejectReason("")
        setChainApproveNote("")
        setChainOpen(true)
    }

    const refreshChainTarget = (id: string) => {
        const latest = useSalaryStore.getState().revisions.find((x) => x.id === id) ?? null
        setChainTarget(latest)
    }

    const handleChainApprove = () => {
        if (!chainTarget) return
        advanceRevisionApproval(chainTarget.id, "HR Manager", chainApproveNote.trim() || undefined)
        toast({ title: "Stage approved", description: chainTarget.employeeName })
        refreshChainTarget(chainTarget.id)
        setChainApproveNote("")
    }

    const handleChainReject = () => {
        if (!chainTarget || !chainRejectStage) return
        if (!chainRejectReason.trim()) {
            toast({ title: "Reason required", variant: "destructive" })
            return
        }
        rejectRevisionStage(chainTarget.id, chainRejectStage, "HR Manager", chainRejectReason.trim())
        toast({ title: "Stage rejected", description: `${chainRejectStage} stage rejected`, variant: "destructive" })
        refreshChainTarget(chainTarget.id)
        setChainRejectStage(null)
        setChainRejectReason("")
    }

    const openLetterGenDialog = (r: SalaryRevision) => {
        setLetterGenTarget(r)
        const defaultTpl: RevisionLetter["templateType"] =
            r.revisionType === "Promotion" ? "Promotion" :
                r.revisionType === "Market Correction" ? "Market Correction" :
                    r.revisionType === "Retention Bonus" ? "Retention" :
                        "Standard"
        setLetterTemplate(defaultTpl)
        setGeneratedLetter(null)
        setLetterGenOpen(true)
    }

    const handleGenerateLetter = () => {
        if (!letterGenTarget) return
        const letter = generateRevisionLetter(letterGenTarget.id, letterTemplate, "HR Manager")
        setGeneratedLetter(letter)
        toast({ title: "Letter generated", description: letter.letterNumber })
    }

    const handleIssueLetter = () => {
        const letterId = generatedLetter?.id ?? viewingLetter?.id
        if (!letterId) return
        issueRevisionLetter(letterId)
        const updated = useSalaryStore.getState().revisionLetters.find((l) => l.id === letterId) ?? null
        if (generatedLetter?.id === letterId) setGeneratedLetter(updated)
        if (viewingLetter?.id === letterId) setViewingLetter(updated)
        toast({ title: "Letter issued", description: "Delivered to employee." })
    }

    const handleDownloadLetter = (letter: RevisionLetter | null) => {
        if (!letter) return
        const html = `<html><body style="font-family: Georgia, serif; padding: 40px; line-height: 1.6; white-space: pre-wrap;">`
            + `<h2 style="color:#8B5CF6;">${letter.templateType} Revision Letter</h2>`
            + `<p><b>Letter No:</b> ${letter.letterNumber} &nbsp; <b>Date:</b> ${letter.generatedDate}</p>`
            + `<hr/><pre style="font-family: Georgia, serif; white-space: pre-wrap;">${letter.bodyText}</pre>`
            + `</body></html>`
        const blob = new Blob([html], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${letter.letterNumber}.html`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Downloaded", description: letter.letterNumber })
    }

    const openLetterViewDialog = (r: SalaryRevision) => {
        if (!r.letterId) return
        const letter = revisionLetters.find((l) => l.id === r.letterId) ?? null
        if (!letter) {
            toast({ title: "Letter not found", variant: "destructive" })
            return
        }
        setViewingLetter(letter)
        setLetterViewOpen(true)
    }

    const openArrearsDialog = (r: SalaryRevision) => {
        setArrearsTarget(r)
        setArrearsFrom(r.arrearsFromDate ?? r.effectiveDate ?? new Date().toISOString().split("T")[0])
        setArrearsTo(new Date().toISOString().split("T")[0])
        setArrearsOpen(true)
    }

    const arrearsPreview = useMemo(() => {
        if (!arrearsTarget || !arrearsFrom || !arrearsTo) return { months: 0, amount: 0 }
        const from = new Date(arrearsFrom)
        const to = new Date(arrearsTo)
        const monthsDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
        const months = Math.max(0, monthsDiff)
        const monthlyDelta = (arrearsTarget.revisedCTC - arrearsTarget.currentCTC) / 12
        return { months, amount: Math.round(monthlyDelta * months) }
    }, [arrearsTarget, arrearsFrom, arrearsTo])

    const handleSaveArrears = () => {
        if (!arrearsTarget) return
        const result = calculateArrears(arrearsTarget.id, arrearsFrom, arrearsTo)
        toast({ title: "Arrears saved", description: `${result.months} months — ${formatINR(result.amount)}` })
        setArrearsOpen(false)
    }

    const budgetSummary = useMemo(() => getRevisionBudgetSummary(budgetYear), [getRevisionBudgetSummary, budgetYear, revisions])
    const prevYearSummary = useMemo(() => getRevisionBudgetSummary(String(Number(budgetYear) - 1)), [getRevisionBudgetSummary, budgetYear, revisions])

    const budgetYearRevisions = useMemo(
        () => revisions.filter((r) => r.effectiveDate.startsWith(budgetYear) && r.status === "Approved"),
        [revisions, budgetYear]
    )

    const budgetAvgInc = budgetYearRevisions.length > 0
        ? (budgetYearRevisions.reduce((s, r) => s + r.incrementPercent, 0) / budgetYearRevisions.length)
        : 0

    const budgetHighestInc = budgetYearRevisions.reduce((max, r) => Math.max(max, r.incrementPercent), 0)

    const budgetCategoryEntries = useMemo(() => {
        const entries = Object.entries(budgetSummary.byCategory).sort((a, b) => b[1] - a[1])
        const total = entries.reduce((s, [, v]) => s + v, 0) || 1
        return entries.map(([k, v]) => ({ name: k, value: v, pct: (v / total) * 100 }))
    }, [budgetSummary])

    const budgetDeptEntries = useMemo(() => {
        const entries = Object.entries(budgetSummary.byDept).sort((a, b) => b[1] - a[1])
        const max = Math.max(1, ...entries.map(([, v]) => v))
        return entries.map(([k, v]) => ({ name: k, value: v, pct: (v / max) * 100 }))
    }, [budgetSummary])

    const handleBudgetExport = () => {
        const lines: string[] = []
        lines.push(`Budget Tracker — ${budgetYear}`)
        lines.push(`Total Spend,${budgetSummary.totalSpend}`)
        lines.push(`Revision Count,${budgetSummary.count}`)
        lines.push(`Avg Increment %,${budgetAvgInc.toFixed(2)}`)
        lines.push(`Highest Increment %,${budgetHighestInc.toFixed(2)}`)
        lines.push("")
        lines.push("Category,Spend")
        budgetCategoryEntries.forEach((e) => lines.push(`${e.name},${e.value}`))
        lines.push("")
        lines.push("Department,Spend")
        budgetDeptEntries.forEach((e) => lines.push(`${e.name},${e.value}`))
        const blob = new Blob([lines.join("\n")], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `budget_${budgetYear}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Budget exported" })
    }

    // CSV parsing
    const parseCsvLine = (line: string): string[] => {
        const out: string[] = []
        let cur = ""
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
                else inQuotes = !inQuotes
            } else if (ch === "," && !inQuotes) {
                out.push(cur); cur = ""
            } else {
                cur += ch
            }
        }
        out.push(cur)
        return out.map((s) => s.trim())
    }

    const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const text = String(reader.result ?? "")
            const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
            if (lines.length < 2) {
                toast({ title: "Empty CSV", variant: "destructive" })
                return
            }
            const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase())
            const idx = (key: string) => header.findIndex((h) => h === key.toLowerCase())
            const iEmpId = idx("employeeId")
            const iName = idx("employeeName")
            const iCode = idx("empCode")
            const iDept = idx("department")
            const iCur = idx("currentCTC")
            const iRev = idx("revisedCTC")
            const iEff = idx("effectiveDate")
            const iReason = idx("reason")
            const iType = idx("revisionType")
            const parsed: { row: Omit<SalaryRevision, "id">; ok: boolean; reason?: string }[] = []
            for (let r = 1; r < lines.length; r++) {
                const cells = parseCsvLine(lines[r])
                const employeeId = iEmpId >= 0 ? cells[iEmpId] : ""
                const employeeName = iName >= 0 ? cells[iName] : ""
                const empCode = iCode >= 0 ? cells[iCode] : ""
                const department = iDept >= 0 ? cells[iDept] : ""
                const currentCTC = Number(iCur >= 0 ? cells[iCur] : 0) || 0
                const revisedCTC = Number(iRev >= 0 ? cells[iRev] : 0) || 0
                const effectiveDate = iEff >= 0 ? cells[iEff] : new Date().toISOString().split("T")[0]
                const reason = iReason >= 0 ? cells[iReason] : ""
                const revisionType = (iType >= 0 ? cells[iType] : "Annual Appraisal") as SalaryRevision["revisionType"]
                const incrementPercent = currentCTC > 0 ? ((revisedCTC - currentCTC) / currentCTC) * 100 : 0
                const row: Omit<SalaryRevision, "id"> = {
                    employeeId, employeeName, empCode, department,
                    currentCTC, revisedCTC, incrementPercent: Number(incrementPercent.toFixed(2)),
                    revisionType: revisionType || "Annual Appraisal",
                    effectiveDate, reason,
                    status: "Pending",
                    submittedDate: new Date().toISOString().split("T")[0],
                    comments: [],
                }
                let ok = true
                let skipReason: string | undefined
                if (!employeeName) { ok = false; skipReason = "missing employeeName" }
                else if (!employeeId) { ok = false; skipReason = "missing employeeId" }
                else if (!revisedCTC) { ok = false; skipReason = "missing revisedCTC" }
                parsed.push({ row, ok, reason: skipReason })
            }
            setImportRows(parsed)
        }
        reader.readAsText(file)
        e.target.value = ""
    }

    const handleConfirmImport = () => {
        const valid = importRows.filter((r) => r.ok).map((r) => r.row)
        if (!valid.length) {
            toast({ title: "No valid rows", variant: "destructive" })
            return
        }
        const result = bulkImportRevisions(valid)
        const invalidCount = importRows.filter((r) => !r.ok).length
        toast({ title: "Import complete", description: `Added ${result.added}, skipped ${result.skipped + invalidCount}.` })
        setImportRows([])
        setImportOpen(false)
    }

    // ── Render ─────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <TrendingUp size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Salary Revision</h1>
                            <p className="text-xs font-medium text-slate-500">Increments, promotions & arrears management</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setBudgetOpen(true)}
                            className="h-9 rounded-lg border-violet-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-violet-50 text-[#8B5CF6]"
                        >
                            <TrendingUp size={14} /> <span className="hidden md:inline">Budget tracker</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => { setImportRows([]); setImportOpen(true) }}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Upload size={14} /> <span className="hidden md:inline">Import CSV</span>
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
                            <Plus size={14} /> <span className="hidden md:inline">New revision</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            <StatCard label="Pending" value={String(stats.pending)} caption="Awaiting approval" icon={Clock} color="#F59E0B" />
                            <StatCard label="Approved" value={String(stats.approved)} caption="This cycle" icon={CheckCircle2} color="#10B981" />
                            <StatCard label="Rejected" value={String(stats.rejected)} caption="Sent back" icon={XCircle} color="#F43F5E" />
                            <StatCard label="Avg increment" value={`${stats.avgInc}%`} caption="Across all revisions" icon={Percent} color="#8B5CF6" />
                            <StatCard label="Annual budget impact" value={formatINR(stats.budgetImpact)} caption={`Arrears: ${formatINR(stats.arrearsTotal)}`} icon={Banknote} color="#0EA5E9" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Main Table */}
                            <Card className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="space-y-2">
                                            <CardTitle className="text-base font-bold text-slate-900">Revision ledger</CardTitle>
                                            <TabsList className="bg-slate-100 p-1 rounded-lg h-9">
                                                {[
                                                    { id: "all", label: `All (${revisions.length})` },
                                                    { id: "pending", label: `Pending (${stats.pending})` },
                                                    { id: "approved", label: `Approved (${stats.approved})` },
                                                    { id: "rejected", label: `Rejected (${stats.rejected})` },
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
                                                    placeholder="Search name, dept, reason..."
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
                                                            <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold h-4 px-1.5">
                                                                {[deptFilter !== "all", typeFilter !== "all"].filter(Boolean).length}
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
                                                        <Label className="text-[11px] font-semibold text-slate-600">Department</Label>
                                                        <Select value={deptFilter} onValueChange={setDeptFilter}>
                                                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All departments</SelectItem>
                                                                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-semibold text-slate-600">Type</Label>
                                                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                                                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All types</SelectItem>
                                                                {REVISION_TYPES.map((t) => <SelectItem key={t} value={t!}>{t}</SelectItem>)}
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
                                                                    checked={filteredRevisions.length > 0 && filteredRevisions.every((r) => selectedIds.includes(r.id))}
                                                                    onCheckedChange={toggleSelectAll}
                                                                    disabled={filteredRevisions.length === 0}
                                                                    className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                />
                                                            </TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                            <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Current CTC</TableHead>
                                                            <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Revised CTC</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Increment</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                            <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredRevisions.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                    No revisions found for this view.
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            filteredRevisions.map((r) => (
                                                                <TableRow key={r.id} className={cn("group border-slate-50", selectedIds.includes(r.id) ? "bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10" : "hover:bg-slate-50/70")}>
                                                                    <TableCell className="pl-6 py-3">
                                                                        <Checkbox
                                                                            checked={selectedIds.includes(r.id)}
                                                                            onCheckedChange={() => toggleSelect(r.id)}
                                                                            className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                                {r.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                            </div>
                                                                            <div className="min-w-0">
                                                                                <div className="text-sm font-semibold text-slate-900 truncate">{r.employeeName}</div>
                                                                                <div className="text-[11px] font-medium text-slate-500 truncate">
                                                                                    {r.empCode ?? r.employeeId} • {r.department}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-semibold",
                                                                            r.revisionType === "Promotion" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                                                r.revisionType === "Market Correction" ? "bg-amber-50 text-amber-600" :
                                                                                    r.revisionType === "Retention Bonus" ? "bg-rose-50 text-rose-600" :
                                                                                        "bg-blue-50 text-blue-600")}>
                                                                            {r.revisionType ?? "Annual"}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-semibold text-slate-800 tabular-nums">{formatINR(r.currentCTC)}</TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-bold text-[#8B5CF6] tabular-nums">{formatINR(r.revisedCTC)}</TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-bold",
                                                                            r.incrementPercent >= 15 ? "bg-emerald-50 text-emerald-600" :
                                                                                r.incrementPercent >= 10 ? "bg-blue-50 text-blue-600" :
                                                                                    r.incrementPercent >= 0 ? "bg-amber-50 text-amber-600" :
                                                                                        "bg-rose-50 text-rose-600")}>
                                                                            <ArrowUpRight size={10} className="mr-0.5" />{r.incrementPercent.toFixed(1)}%
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="flex flex-col gap-1 items-start">
                                                                            <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                                r.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                                                    r.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                                                        "bg-amber-50 text-amber-600")}>
                                                                                {r.status}
                                                                            </Badge>
                                                                            {r.approvalChain && r.currentApprovalStage && r.currentApprovalStage !== "Complete" && (
                                                                                <Badge className="border-none text-[9px] font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] px-1.5">
                                                                                    <GitBranch size={9} className="mr-0.5" /> {r.currentApprovalStage} stage
                                                                                </Badge>
                                                                            )}
                                                                            {r.letterId && (() => {
                                                                                const letter = revisionLetters.find((l) => l.id === r.letterId)
                                                                                if (!letter) return null
                                                                                return (
                                                                                    <Badge className={cn("border-none text-[9px] font-bold px-1.5",
                                                                                        letter.issued ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600")}>
                                                                                        <FileText size={9} className="mr-0.5" /> {letter.issued ? "Issued" : "Draft"}
                                                                                    </Badge>
                                                                                )
                                                                            })()}
                                                                            {r.arrearsAmount && r.arrearsAmount > 0 && (
                                                                                <Badge className="border-none text-[9px] font-bold bg-rose-50 text-rose-600 px-1.5">
                                                                                    <Banknote size={9} className="mr-0.5" /> {formatINR(r.arrearsAmount)}
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
                                                                                        onClick={() => { setViewingRevision(r); setDetailOpen(true) }}
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
                                                                                    {r.status === "Pending" && (
                                                                                        <>
                                                                                            <DropdownMenuItem onClick={() => handleApprove(r)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                                <CheckCircle2 size={13} className="mr-2" /> Approve
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuItem onClick={() => openRejectDialog(r.id)} className="cursor-pointer text-xs font-medium text-rose-600">
                                                                                                <XCircle size={13} className="mr-2" /> Reject
                                                                                            </DropdownMenuItem>
                                                                                        </>
                                                                                    )}
                                                                                    <DropdownMenuItem onClick={() => openEditForm(r)} className="cursor-pointer text-xs font-medium">
                                                                                        <Edit size={13} className="mr-2" /> Edit
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => { setViewingRevision(r); setDetailOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                                        <MessageSquare size={13} className="mr-2" /> Comments
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem onClick={() => openChainDialog(r)} className="cursor-pointer text-xs font-medium text-[#8B5CF6]">
                                                                                        <GitBranch size={13} className="mr-2" /> Approval chain
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => openLetterGenDialog(r)} className="cursor-pointer text-xs font-medium">
                                                                                        <FileCheck size={13} className="mr-2" /> Generate letter
                                                                                    </DropdownMenuItem>
                                                                                    {r.letterId && (
                                                                                        <DropdownMenuItem onClick={() => openLetterViewDialog(r)} className="cursor-pointer text-xs font-medium">
                                                                                            <FileText size={13} className="mr-2" /> View letter
                                                                                        </DropdownMenuItem>
                                                                                    )}
                                                                                    <DropdownMenuItem onClick={() => openArrearsDialog(r)} className="cursor-pointer text-xs font-medium">
                                                                                        <Calculator size={13} className="mr-2" /> Calculate arrears
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem onClick={() => handleDelete(r.id)} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
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
                                        </TabsContent>
                                    </CardContent>
                                </Tabs>
                            </Card>

                            {/* Dept budget impact */}
                            <Card className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 space-y-0">
                                    <CardTitle className="text-base font-bold text-slate-900">Dept-wise impact</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        Annual budget increase from approved revisions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5">
                                    {deptBudgets.length === 0 ? (
                                        <div className="p-6 text-center text-slate-400 text-xs font-medium">
                                            No approved revisions yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {deptBudgets.map((d) => (
                                                <div key={d.name} className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-xs font-bold text-slate-700">{d.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                                                            {formatINR(d.totalImpact)}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-[#8B5CF6] rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(d.totalImpact / maxDeptImpact) * 100}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] font-medium text-slate-400">
                                                        {d.count} revision{d.count > 1 ? "s" : ""} approved
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* ── Create/Edit Dialog ───────────────── */}
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingRevision ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingRevision ? "Edit revision" : "New salary revision"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Submit for HR approval with context. Arrears are auto-suggested from effective date.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-5">
                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Employee name" required>
                                            <Input value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Employee code">
                                            <Input value={form.empCode} onChange={(e) => setForm({ ...form, empCode: e.target.value })} className="h-10 text-sm font-medium" placeholder="EMP001" />
                                        </FormField>
                                        <FormField label="Employee ID" required>
                                            <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Designation">
                                            <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="h-10 text-sm font-medium" placeholder="Senior Engineer" />
                                        </FormField>
                                        <FormField label="Department" required>
                                            <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Revision type" required>
                                            <Select value={form.revisionType ?? "Annual Appraisal"} onValueChange={(v) => setForm({ ...form, revisionType: v as SalaryRevision["revisionType"] })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {REVISION_TYPES.map((t) => <SelectItem key={t} value={t!}>{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compensation change</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Current CTC (₹/year)" required>
                                            <Input type="number" value={form.currentCTC || ""} onChange={(e) => setForm({ ...form, currentCTC: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                        </FormField>
                                        <FormField label="Proposed CTC (₹/year)" required>
                                            <Input type="number" value={form.revisedCTC || ""} onChange={(e) => setForm({ ...form, revisedCTC: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                        </FormField>
                                        <FormField label="Effective date" required>
                                            <Input type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Linked appraisal">
                                            {backendAppraisals.length > 0 ? (
                                                <Select
                                                    value={form.linkedAppraisalId || "none"}
                                                    onValueChange={(v) => setForm({ ...form, linkedAppraisalId: v === "none" ? "" : v })}
                                                >
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Pick appraisal" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Not linked</SelectItem>
                                                        {backendAppraisals
                                                            .filter((a) => {
                                                                // If the form has an employee selected, filter to that employee's appraisals
                                                                if (!form.empCode) return true
                                                                const aEmp = typeof a.employeeId === "object" ? a.employeeId : null
                                                                return aEmp?.employeeCode === form.empCode
                                                            })
                                                            .map((a) => {
                                                                const aEmp = typeof a.employeeId === "object" ? a.employeeId : null
                                                                const label = `${a.period ?? "—"}${aEmp ? ` · ${aEmp.firstName ?? ""} ${aEmp.lastName ?? ""}`.trim() : ""}${a.overallRating ? ` · ${a.overallRating}★` : ""}`
                                                                return <SelectItem key={a._id} value={a._id}>{label}</SelectItem>
                                                            })}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input value={form.linkedAppraisalId} onChange={(e) => setForm({ ...form, linkedAppraisalId: e.target.value })} className="h-10 text-sm font-medium" placeholder="APR-2026-001" />
                                            )}
                                        </FormField>
                                    </div>

                                    {form.currentCTC > 0 && form.revisedCTC > 0 && (
                                        <div className={cn("p-3 rounded-xl border flex items-center justify-between",
                                            incrementPercent >= 0 ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200")}>
                                            <div className="flex items-center gap-2">
                                                <Calculator size={14} className="text-[#8B5CF6]" />
                                                <span className="text-xs font-semibold text-slate-700">Increment</span>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn("text-lg font-bold tabular-nums", incrementPercent >= 0 ? "text-emerald-600" : "text-rose-600")}>
                                                    {incrementPercent >= 0 ? "+" : ""}{incrementPercent.toFixed(2)}%
                                                </p>
                                                <p className="text-[10px] font-medium text-slate-500">
                                                    {monthlyChange >= 0 ? "+" : ""}{formatINR(monthlyChange)}/mo change
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arrears (optional)</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Arrears from date">
                                            <Input type="date" value={form.arrearsFromDate ?? ""} onChange={(e) => setForm({ ...form, arrearsFromDate: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Arrears amount (₹)">
                                            <Input type="number" value={form.arrearsAmount || ""} onChange={(e) => setForm({ ...form, arrearsAmount: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                        </FormField>
                                    </div>
                                    {suggestedArrears > 0 && form.arrearsAmount !== suggestedArrears && (
                                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle size={14} className="text-blue-600 shrink-0" />
                                                <span className="text-[11px] font-semibold text-blue-800">
                                                    Suggested: {formatINR(suggestedArrears)} based on effective date
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setForm({ ...form, arrearsAmount: suggestedArrears })}
                                                className="h-7 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Use
                                            </Button>
                                        </div>
                                    )}
                                </section>

                                <FormField label="Reason / Justification">
                                    <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Annual appraisal, promotion justification, market correction context..." className="min-h-[70px] text-xs font-medium" />
                                </FormField>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                            <Button variant="ghost" onClick={() => setFormOpen(false)} className="h-10 px-5 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSave} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs border-none">
                                {editingRevision ? "Save changes" : "Submit for approval"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Detail Sheet ───────────────────── */}
                <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                    <SheetContent className="sm:max-w-xl p-0 font-sans">
                        {viewingRevision && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-50 p-6 border-b border-slate-100 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Badge className={cn("border-none text-[10px] font-semibold px-2 py-0.5 mb-2 w-fit",
                                                viewingRevision.revisionType === "Promotion" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                    viewingRevision.revisionType === "Market Correction" ? "bg-amber-50 text-amber-600" :
                                                        viewingRevision.revisionType === "Retention Bonus" ? "bg-rose-50 text-rose-600" :
                                                            "bg-blue-50 text-blue-600")}>
                                                {viewingRevision.revisionType ?? "Annual Appraisal"}
                                            </Badge>
                                            <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">{viewingRevision.employeeName}</SheetTitle>
                                            <SheetDescription className="text-[11px] font-medium text-slate-500 truncate">
                                                {viewingRevision.empCode ?? viewingRevision.employeeId} • {viewingRevision.department}{viewingRevision.designation ? ` • ${viewingRevision.designation}` : ""}
                                            </SheetDescription>
                                        </div>
                                        <Badge className={cn("border-none text-[10px] font-semibold px-2 shrink-0",
                                            viewingRevision.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                viewingRevision.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                    "bg-amber-50 text-amber-600")}>
                                            {viewingRevision.status}
                                        </Badge>
                                    </div>
                                </SheetHeader>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-5">
                                        <section className="grid grid-cols-3 gap-3">
                                            <MetricCard label="Current CTC" value={formatINR(viewingRevision.currentCTC)} />
                                            <MetricCard label="Revised CTC" value={formatINR(viewingRevision.revisedCTC)} color="text-[#8B5CF6]" />
                                            <MetricCard label="Increment" value={`${viewingRevision.incrementPercent.toFixed(2)}%`} color={viewingRevision.incrementPercent >= 10 ? "text-emerald-600" : "text-amber-600"} />
                                            <MetricCard label="Monthly change" value={formatINR((viewingRevision.revisedCTC - viewingRevision.currentCTC) / 12)} />
                                            <MetricCard label="Annual impact" value={formatINR(viewingRevision.revisedCTC - viewingRevision.currentCTC)} color="text-blue-600" />
                                            <MetricCard label="Arrears" value={viewingRevision.arrearsAmount ? formatINR(viewingRevision.arrearsAmount) : "—"} color={viewingRevision.arrearsAmount ? "text-rose-600" : "text-slate-400"} />
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Approval workflow</div>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {["Submitted", "Manager", "HR", "Finance", "Final"].map((step, i) => {
                                                    const completed =
                                                        (step === "Submitted" && viewingRevision.submittedDate) ||
                                                        (step !== "Submitted" && viewingRevision.status === "Approved") ||
                                                        (step === "Final" && viewingRevision.status === "Approved")
                                                    const blocked = step !== "Submitted" && viewingRevision.status === "Rejected"
                                                    return (
                                                        <React.Fragment key={step}>
                                                            <div className={cn(
                                                                "h-7 px-3 rounded-md flex items-center text-[10px] font-bold border",
                                                                completed ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                    blocked ? "bg-rose-50 text-rose-700 border-rose-200" :
                                                                        viewingRevision.status === "Pending" && step === "Manager" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                            "bg-slate-50 text-slate-400 border-slate-200"
                                                            )}>
                                                                {step}
                                                            </div>
                                                            {i < 4 && <ArrowUpRight size={12} className="text-slate-300 rotate-45" />}
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </div>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timeline</div>
                                            <div className="space-y-1.5">
                                                <PolicyRow label="Submitted" value={viewingRevision.submittedDate ?? "—"} />
                                                <PolicyRow label="Effective from" value={viewingRevision.effectiveDate} />
                                                {viewingRevision.approvedDate && <PolicyRow label="Approved" value={`${viewingRevision.approvedDate}${viewingRevision.approvedBy ? ` by ${viewingRevision.approvedBy}` : ""}`} valueColor="text-emerald-600" />}
                                                {viewingRevision.rejectedDate && <PolicyRow label="Rejected" value={`${viewingRevision.rejectedDate}${viewingRevision.rejectedBy ? ` by ${viewingRevision.rejectedBy}` : ""}`} valueColor="text-rose-600" />}
                                                {viewingRevision.linkedAppraisalId && <PolicyRow label="Linked appraisal" value={viewingRevision.linkedAppraisalId} />}
                                            </div>
                                        </section>

                                        {viewingRevision.reason && (
                                            <section>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Reason</div>
                                                <p className="text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100">{viewingRevision.reason}</p>
                                            </section>
                                        )}

                                        {viewingRevision.rejectionReason && (
                                            <section>
                                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Rejection reason</div>
                                                <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                                    <p className="text-xs font-semibold text-rose-800">{viewingRevision.rejectionReason}</p>
                                                </div>
                                            </section>
                                        )}

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Comments ({viewingRevision.comments?.length ?? 0})
                                            </div>
                                            <div className="space-y-2 mb-3">
                                                {(viewingRevision.comments ?? []).length === 0 && (
                                                    <p className="text-xs text-slate-400 italic">No comments yet.</p>
                                                )}
                                                {(viewingRevision.comments ?? []).map((cm) => (
                                                    <div key={cm.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="text-xs font-bold text-slate-800">{cm.author}</span>
                                                            <span className="text-[10px] font-medium text-slate-400">{new Date(cm.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{cm.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="h-9 text-xs font-medium"
                                                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                                />
                                                <Button
                                                    onClick={handleAddComment}
                                                    disabled={!commentText.trim()}
                                                    size="sm"
                                                    className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-semibold text-xs border-none gap-1 px-3"
                                                >
                                                    <Send size={12} /> Post
                                                </Button>
                                            </div>
                                        </section>
                                    </div>
                                </ScrollArea>

                                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2 flex-wrap">
                                    {viewingRevision.status === "Pending" && (
                                        <>
                                            <Button
                                                onClick={() => { handleApprove(viewingRevision); setDetailOpen(false) }}
                                                className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none"
                                            >
                                                <CheckCircle2 size={13} className="mr-1.5" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => { openRejectDialog(viewingRevision.id); setDetailOpen(false) }}
                                                variant="outline"
                                                className="flex-1 h-10 text-rose-500 border-rose-200 font-bold text-xs hover:bg-rose-50"
                                            >
                                                <XCircle size={13} className="mr-1.5" /> Reject
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        onClick={() => { openEditForm(viewingRevision); setDetailOpen(false) }}
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

                {/* ── Reject Dialog ───────────────────── */}
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <XCircle size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Reject revision</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Provide a reason — it's persisted to the revision record.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <FormField label="Reason" required>
                                <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g., Budget overshoot this cycle, defer to next quarter..." className="min-h-[90px] text-xs font-medium" />
                            </FormField>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setRejectOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmReject} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Confirm reject
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Approval Chain Dialog ─────────── */}
                <Dialog open={chainOpen} onOpenChange={setChainOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <GitBranch size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Approval chain {chainTarget ? `— ${chainTarget.employeeName}` : ""}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Multi-level approval: Manager → HR → Finance. Each stage must be approved sequentially.
                            </DialogDescription>
                        </DialogHeader>
                        {chainTarget && (() => {
                            const defaultChain: RevisionApprovalStep[] = [
                                { stage: "Manager", status: "Pending" },
                                { stage: "HR", status: "Pending" },
                                { stage: "Finance", status: "Pending" },
                            ]
                            const chain: RevisionApprovalStep[] = chainTarget.approvalChain ?? defaultChain
                            const nextPending = chain.find((s) => s.status === "Pending")
                            const anyRejected = chain.some((s) => s.status === "Rejected")
                            const allApproved = chain.every((s) => s.status === "Approved")
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
                                                    {step.status === "Approved" ? <UserCheck size={15} /> :
                                                        step.status === "Rejected" ? <UserX size={15} /> :
                                                            <UserCheck size={15} />}
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
                                                    {step.notes && (
                                                        <div className="text-[10px] font-medium text-slate-500 mt-0.5 italic">Note: {step.notes}</div>
                                                    )}
                                                    {step.rejectionReason && (
                                                        <div className="text-[10px] font-semibold text-rose-700 mt-1">
                                                            Reason: {step.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                                {step.stage === nextPending?.stage && !chainRejectStage && (
                                                    <div className="flex gap-1 shrink-0">
                                                        <Button
                                                            size="sm"
                                                            onClick={handleChainApprove}
                                                            className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold px-3 border-none gap-1"
                                                        >
                                                            <UserCheck size={11} /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setChainRejectStage(step.stage)}
                                                            variant="outline"
                                                            className="h-8 text-rose-600 border-rose-300 text-[10px] font-semibold px-3 hover:bg-rose-50 gap-1"
                                                        >
                                                            <UserX size={11} /> Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {nextPending && !chainRejectStage && (
                                        <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <Label className="text-[11px] font-semibold text-slate-600">Approval note (optional)</Label>
                                            <Input
                                                value={chainApproveNote}
                                                onChange={(e) => setChainApproveNote(e.target.value)}
                                                placeholder="e.g., reviewed and aligned with budget"
                                                className="h-9 text-xs font-medium bg-white"
                                            />
                                        </div>
                                    )}

                                    {allApproved && (
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                            <span className="text-xs font-bold text-emerald-800">All stages approved — revision ratified.</span>
                                        </div>
                                    )}
                                    {anyRejected && (
                                        <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-center gap-2">
                                            <AlertCircle size={14} className="text-rose-600 shrink-0" />
                                            <span className="text-xs font-bold text-rose-800">Chain rejected. Fix issues and resubmit.</span>
                                        </div>
                                    )}
                                    {chainRejectStage && (
                                        <div className="space-y-2 p-3 bg-rose-50 rounded-lg border border-rose-200">
                                            <Label className="text-[11px] font-semibold text-rose-700">Rejection reason for {chainRejectStage}</Label>
                                            <Textarea
                                                value={chainRejectReason}
                                                onChange={(e) => setChainRejectReason(e.target.value)}
                                                placeholder="Explain why this stage is being rejected..."
                                                className="min-h-[70px] text-xs font-medium bg-white"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => { setChainRejectStage(null); setChainRejectReason("") }}
                                                    className="h-8 text-[11px] font-semibold flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleChainReject}
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
                            <Button variant="ghost" onClick={() => setChainOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Generate Letter Dialog ─────────── */}
                <Dialog open={letterGenOpen} onOpenChange={setLetterGenOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <FileCheck size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Generate revision letter {letterGenTarget ? `— ${letterGenTarget.employeeName}` : ""}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Pick a template and generate a draft letter. Issue it to send to the employee.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex-1 overflow-y-auto space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-slate-600">Template</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(["Standard", "Promotion", "Retention", "Market Correction"] as RevisionLetter["templateType"][]).map((t) => (
                                        <label
                                            key={t}
                                            className={cn("flex items-center gap-2 p-3 rounded-lg border cursor-pointer",
                                                letterTemplate === t ? "border-[#8B5CF6] bg-[#8B5CF6]/5 ring-1 ring-[#8B5CF6]" : "border-slate-200 bg-white hover:bg-slate-50")}
                                        >
                                            <input
                                                type="radio"
                                                name="letterTemplate"
                                                checked={letterTemplate === t}
                                                onChange={() => setLetterTemplate(t)}
                                                className="accent-[#8B5CF6]"
                                            />
                                            <span className="text-xs font-semibold text-slate-800">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {!generatedLetter && (
                                <Button
                                    onClick={handleGenerateLetter}
                                    className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-2"
                                >
                                    <FileCheck size={14} /> Generate letter
                                </Button>
                            )}

                            {generatedLetter && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preview</div>
                                            <div className="text-xs font-bold text-slate-800">{generatedLetter.letterNumber}</div>
                                        </div>
                                        <Badge className={cn("border-none text-[10px] font-bold",
                                            generatedLetter.issued ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700")}>
                                            {generatedLetter.issued ? "Issued" : "Draft"}
                                        </Badge>
                                    </div>
                                    <pre className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                                        {generatedLetter.bodyText}
                                    </pre>
                                    <div className="flex gap-2 flex-wrap">
                                        {!generatedLetter.issued && (
                                            <Button
                                                onClick={handleIssueLetter}
                                                className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none gap-2 px-4"
                                            >
                                                <Send size={13} /> Issue to employee
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleDownloadLetter(generatedLetter)}
                                            variant="outline"
                                            className="h-9 rounded-lg font-semibold text-xs border-slate-200 gap-2 px-4"
                                        >
                                            <Download size={13} /> Download (mock PDF)
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setLetterGenOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Letter View Dialog ───────────── */}
                <Dialog open={letterViewOpen} onOpenChange={setLetterViewOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <FileText size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {viewingLetter?.letterNumber ?? "Revision letter"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {viewingLetter ? `${viewingLetter.templateType} • Generated ${viewingLetter.generatedDate} by ${viewingLetter.generatedBy}` : ""}
                            </DialogDescription>
                        </DialogHeader>
                        {viewingLetter && (
                            <div className="mt-4 flex-1 overflow-y-auto space-y-3">
                                <div className="flex items-center justify-between">
                                    <Badge className={cn("border-none text-[10px] font-bold",
                                        viewingLetter.issued ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700")}>
                                        {viewingLetter.issued ? `Issued${viewingLetter.issuedDate ? ` on ${viewingLetter.issuedDate}` : ""}` : "Draft"}
                                    </Badge>
                                </div>
                                <pre className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                                    {viewingLetter.bodyText}
                                </pre>
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setLetterViewOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            <Button
                                onClick={handleIssueLetter}
                                variant="outline"
                                className="h-10 rounded-lg font-semibold text-xs border-slate-200 gap-2"
                            >
                                <Send size={13} /> Re-issue
                            </Button>
                            <Button
                                onClick={() => handleDownloadLetter(viewingLetter)}
                                className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2"
                            >
                                <Download size={13} /> Download
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Arrears Calculator Dialog ─────── */}
                <Dialog open={arrearsOpen} onOpenChange={setArrearsOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Calculator size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Arrears calculator {arrearsTarget ? `— ${arrearsTarget.employeeName}` : ""}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Compute pending back-pay between two dates at the revised CTC delta.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="From date">
                                    <Input type="date" value={arrearsFrom} onChange={(e) => setArrearsFrom(e.target.value)} className="h-10 text-sm font-medium" />
                                </FormField>
                                <FormField label="To date">
                                    <Input type="date" value={arrearsTo} onChange={(e) => setArrearsTo(e.target.value)} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <div className="p-4 rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preview</div>
                                    <div className="text-xs font-semibold text-slate-700 mt-0.5">
                                        {arrearsPreview.months} month{arrearsPreview.months !== 1 ? "s" : ""}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-[#8B5CF6] tabular-nums">{formatINR(arrearsPreview.amount)}</div>
                                    <div className="text-[10px] font-medium text-slate-500">Total arrears</div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setArrearsOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveArrears} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                <Calculator size={13} /> Save arrears
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Budget Tracker Dialog ─────────── */}
                <Dialog open={budgetOpen} onOpenChange={setBudgetOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                        <TrendingUp size={20} />
                                    </div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">Budget tracker</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        Annualized revision spend by year, category, and department.
                                    </DialogDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={budgetYear}
                                        onChange={(e) => setBudgetYear(e.target.value)}
                                        className="h-9 w-24 text-xs font-semibold tabular-nums"
                                        placeholder="Year"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleBudgetExport}
                                        className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-2 px-3"
                                    >
                                        <Download size={13} /> CSV
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <BudgetKpi label="Total spend" value={formatINR(budgetSummary.totalSpend)} color="#8B5CF6" />
                                    <BudgetKpi label="Revisions" value={String(budgetSummary.count)} color="#10B981" />
                                    <BudgetKpi label="Avg increment" value={`${budgetAvgInc.toFixed(1)}%`} color="#0EA5E9" />
                                    <BudgetKpi label="Highest increment" value={`${budgetHighestInc.toFixed(1)}%`} color="#F59E0B" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="rounded-xl border-slate-200 shadow-none">
                                        <CardHeader className="p-4 border-b border-slate-100">
                                            <CardTitle className="text-sm font-bold text-slate-900">By category</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            {budgetCategoryEntries.length === 0 ? (
                                                <p className="text-xs text-slate-400 italic">No data.</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {budgetCategoryEntries.map((c, i) => (
                                                        <div key={c.name} className="space-y-1">
                                                            <div className="flex justify-between items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-700 truncate">{c.name}</span>
                                                                <span className="text-[10px] font-bold text-slate-500 tabular-nums shrink-0">
                                                                    {formatINR(c.value)} • {c.pct.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full rounded-full"
                                                                    style={{ backgroundColor: ["#8B5CF6", "#10B981", "#F59E0B", "#0EA5E9", "#F43F5E"][i % 5] }}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${c.pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-xl border-slate-200 shadow-none">
                                        <CardHeader className="p-4 border-b border-slate-100">
                                            <CardTitle className="text-sm font-bold text-slate-900">By department</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            {budgetDeptEntries.length === 0 ? (
                                                <p className="text-xs text-slate-400 italic">No data.</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {budgetDeptEntries.map((d) => (
                                                        <div key={d.name} className="space-y-1">
                                                            <div className="flex justify-between items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-700 truncate">{d.name}</span>
                                                                <span className="text-[10px] font-bold text-slate-500 tabular-nums shrink-0">{formatINR(d.value)}</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-[#8B5CF6] rounded-full"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${d.pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="rounded-xl border-slate-200 shadow-none">
                                    <CardHeader className="p-4 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold text-slate-900">Year-over-year</CardTitle>
                                        <CardDescription className="text-[11px] font-medium text-slate-500">
                                            {budgetYear} vs {Number(budgetYear) - 1}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{Number(budgetYear) - 1}</div>
                                            <div className="text-lg font-bold text-slate-700 tabular-nums mt-0.5">{formatINR(prevYearSummary.totalSpend)}</div>
                                            <div className="text-[10px] font-medium text-slate-500">{prevYearSummary.count} revisions</div>
                                        </div>
                                        <div className="p-3 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/20">
                                            <div className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">{budgetYear}</div>
                                            <div className="text-lg font-bold text-[#8B5CF6] tabular-nums mt-0.5">{formatINR(budgetSummary.totalSpend)}</div>
                                            <div className="text-[10px] font-medium text-slate-500">
                                                {budgetSummary.count} revisions
                                                {prevYearSummary.totalSpend > 0 && (
                                                    <> • {((budgetSummary.totalSpend - prevYearSummary.totalSpend) / prevYearSummary.totalSpend * 100).toFixed(1)}% YoY</>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button variant="ghost" onClick={() => setBudgetOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Import Dialog ─────────────── */}
                <Dialog open={importOpen} onOpenChange={setImportOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Upload size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Import revisions (CSV)</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Columns: employeeId, employeeName, empCode, department, currentCTC, revisedCTC, effectiveDate, reason, revisionType.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <input
                                ref={importFileInputRef}
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleImportFileChange}
                                className="hidden"
                            />
                            <div className="flex flex-wrap gap-2 items-center justify-between">
                                <Button
                                    onClick={() => importFileInputRef.current?.click()}
                                    className="h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-2 px-4"
                                >
                                    <Upload size={13} /> Choose CSV file
                                </Button>
                                {importRows.length > 0 && (
                                    <div className="text-xs font-semibold text-slate-600">
                                        {importRows.filter((r) => r.ok).length} valid • {importRows.filter((r) => !r.ok).length} will be skipped
                                    </div>
                                )}
                            </div>

                            {importRows.length > 0 && (
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="max-h-[380px] overflow-y-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50 sticky top-0">
                                                <TableRow className="border-slate-100 hover:bg-transparent">
                                                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">#</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Employee</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Dept</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Current</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Revised</TableHead>
                                                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {importRows.slice(0, 20).map((r, i) => (
                                                    <TableRow key={i} className={cn("border-slate-50", !r.ok && "bg-rose-50/50")}>
                                                        <TableCell className="py-2 text-[11px] font-medium text-slate-500">{i + 1}</TableCell>
                                                        <TableCell className="py-2 text-xs font-semibold text-slate-800">
                                                            {r.row.employeeName || <span className="text-rose-500 italic">—</span>}
                                                            <div className="text-[10px] font-medium text-slate-500">{r.row.employeeId}</div>
                                                        </TableCell>
                                                        <TableCell className="py-2 text-xs font-medium text-slate-700">{r.row.department}</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-semibold tabular-nums">{formatINR(r.row.currentCTC)}</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold text-[#8B5CF6] tabular-nums">{formatINR(r.row.revisedCTC)}</TableCell>
                                                        <TableCell className="py-2">
                                                            {r.ok ? (
                                                                <Badge className="border-none text-[9px] font-bold bg-emerald-50 text-emerald-600">Ready</Badge>
                                                            ) : (
                                                                <Badge className="border-none text-[9px] font-bold bg-rose-50 text-rose-600" title={r.reason}>
                                                                    Skip: {r.reason}
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {importRows.length > 20 && (
                                        <div className="p-2 text-center text-[11px] font-medium text-slate-500 bg-slate-50 border-t border-slate-100">
                                            ... and {importRows.length - 20} more row{importRows.length - 20 > 1 ? "s" : ""}
                                        </div>
                                    )}
                                </div>
                            )}

                            {importRows.length === 0 && (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                                    <p className="text-xs font-semibold text-slate-600">Choose a CSV file to preview rows</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1">First row must be the header.</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                            <Button variant="ghost" onClick={() => setImportOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button
                                onClick={handleConfirmImport}
                                disabled={importRows.filter((r) => r.ok).length === 0}
                                className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2 disabled:opacity-50"
                            >
                                <Upload size={13} /> Import {importRows.filter((r) => r.ok).length || ""}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Delete Confirm ─────────────── */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete {selectedIds.length} revision{selectedIds.length > 1 ? "s" : ""}?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">This cannot be undone.</DialogDescription>
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

const PolicyRow = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={cn("text-xs font-semibold", valueColor ?? "text-slate-800")}>{value}</span>
    </div>
)

const BudgetKpi = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="p-3 rounded-xl border border-slate-200 bg-white" style={{ borderLeft: `3px solid ${color}` }}>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-lg font-bold tabular-nums mt-0.5" style={{ color }}>{value}</div>
    </div>
)

export default SalaryRevisionPage
