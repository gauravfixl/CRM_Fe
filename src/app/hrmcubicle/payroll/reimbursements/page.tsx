"use client"

import React, { useState, useMemo, useRef } from "react"
import {
    Wallet,
    ShieldCheck,
    Search,
    Receipt,
    Trash2,
    CheckCircle2,
    FileText,
    AlertCircle,
    Eye,
    X,
    Filter,
    XCircle,
    MoreHorizontal,
    Clock,
    History,
    Download,
    MessageSquare,
    Plus,
    Edit,
    Upload,
    Calendar,
    ChevronDown,
    RotateCcw,
    Settings,
    DollarSign,
    TrendingUp,
    Send,
    Banknote,
    ScanLine,
    Wand2,
    Sparkles,
    ShieldAlert,
    FileWarning,
    Route,
    Copy,
    Check,
    Link2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog"
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
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/shared/components/ui/sheet"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { usePayrollStore, type ReimbursementClaim, type ReimbursementCategory, type ReimbursementPolicyRule, type ReceiptOcr } from "@/shared/data/payroll-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt: number) => `₹${Math.round(amt).toLocaleString("en-IN")}`

const REJECTION_TAGS = [
    "Policy Cap Hit",
    "Illegible Document",
    "Invalid Category",
    "Duplicate Claim",
    "Outside Window",
    "Missing Receipt",
]

const emptyClaimForm: Omit<ReimbursementClaim, "id"> = {
    empCode: "",
    employeeName: "",
    employeeId: "",
    dept: "",
    category: "Medical",
    amount: 0,
    description: "",
    submittedDate: new Date().toISOString().split("T")[0],
    status: "Pending",
    taxable: false,
    comments: [],
}

const ReimbursementsPage = () => {
    const {
        claims,
        reimbursementCategories,
        payRuns,
        addClaim,
        updateClaim,
        deleteClaim,
        approveClaim,
        rejectClaim,
        markClaimPaid,
        bulkUpdateClaimStatus,
        bulkDeleteClaims,
        addClaimComment,
        addReimbursementCategory,
        updateReimbursementCategory,
        deleteReimbursementCategory,
        // ─ Round 2 ─
        runOcrOnClaim,
        bulkRunOcrClaims,
        detectDuplicateClaim,
        bulkDetectDuplicates,
        autoValidateClaim,
        bulkAutoValidateClaims,
        computeMileage,
        reimbursementPolicyRules,
        addReimbursementPolicyRule,
        updateReimbursementPolicyRule,
        deleteReimbursementPolicyRule,
    } = usePayrollStore()
    const { toast } = useToast()

    // ── Filters ─────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [dateFrom, setDateFrom] = useState<string>("")
    const [dateTo, setDateTo] = useState<string>("")

    // ── Selection ───────────────────────────────────────
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // ── Dialog state ────────────────────────────────────
    const [formOpen, setFormOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [paidOpen, setPaidOpen] = useState(false)
    const [categoryPolicyOpen, setCategoryPolicyOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [categoryFormOpen, setCategoryFormOpen] = useState(false)
    const [categoryDeleteOpen, setCategoryDeleteOpen] = useState(false)

    // ─ Round 2 state ─
    const [ocrResultOpen, setOcrResultOpen] = useState(false)
    const [ocrTarget, setOcrTarget] = useState<ReimbursementClaim | null>(null)
    const [bulkOcrResult, setBulkOcrResult] = useState<{ processed: number } | null>(null)
    const [bulkDupResult, setBulkDupResult] = useState<{ duplicates: number } | null>(null)
    const [bulkValidateResult, setBulkValidateResult] = useState<{ validated: number; flagged: number } | null>(null)
    const [policyOpen, setPolicyOpen] = useState(false)
    const [editingPolicy, setEditingPolicy] = useState<ReimbursementPolicyRule | null>(null)
    const [policyForm, setPolicyForm] = useState<Omit<ReimbursementPolicyRule, "id">>({
        category: "",
        monthlyCap: 0,
        perClaimCap: 0,
        receiptRequired: true,
        autoApproveIfWithinCap: false,
        autoRejectIfNoReceipt: false,
        mileageRatePerKm: 10,
        active: true,
    })
    const [mileageOpen, setMileageOpen] = useState(false)
    const [mileageCategory, setMileageCategory] = useState<string>("")
    const [mileageKm, setMileageKm] = useState<number>(0)
    const [linkDupOpen, setLinkDupOpen] = useState(false)
    const [linkDupTarget, setLinkDupTarget] = useState<ReimbursementClaim | null>(null)
    const [linkDupSelectedId, setLinkDupSelectedId] = useState<string>("")

    const [selectedClaim, setSelectedClaim] = useState<ReimbursementClaim | null>(null)
    const [editingClaim, setEditingClaim] = useState<ReimbursementClaim | null>(null)
    const [formData, setFormData] = useState<Omit<ReimbursementClaim, "id">>(emptyClaimForm)
    const [receiptFile, setReceiptFile] = useState<File | null>(null)

    const [rejectionReason, setRejectionReason] = useState("")
    const [rejectionTags, setRejectionTags] = useState<string[]>([])
    const [rejectTargetIds, setRejectTargetIds] = useState<string[]>([])
    const [paidRunId, setPaidRunId] = useState<string>("")
    const [paidTargetIds, setPaidTargetIds] = useState<string[]>([])

    const [commentText, setCommentText] = useState("")

    const [editingCategory, setEditingCategory] = useState<ReimbursementCategory | null>(null)
    const [categoryForm, setCategoryForm] = useState<Omit<ReimbursementCategory, "id">>({
        name: "",
        monthlyLimit: 0,
        taxable: false,
        color: "#8B5CF6",
        description: "",
        active: true,
    })
    const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // ── Derived data ────────────────────────────────────
    const activeCategories = useMemo(
        () => reimbursementCategories.filter((c) => c.active),
        [reimbursementCategories]
    )

    const filteredClaims = useMemo(() => {
        return claims.filter((c) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                if (
                    !c.employeeName.toLowerCase().includes(q) &&
                    !(c.empCode ?? "").toLowerCase().includes(q) &&
                    !c.employeeId.toLowerCase().includes(q) &&
                    !(c.description ?? "").toLowerCase().includes(q) &&
                    !c.category.toLowerCase().includes(q)
                ) {
                    return false
                }
            }
            if (statusFilter !== "all" && c.status !== statusFilter) return false
            if (categoryFilter !== "all" && c.category !== categoryFilter) return false
            if (dateFrom && c.submittedDate < dateFrom) return false
            if (dateTo && c.submittedDate > dateTo) return false
            return true
        })
    }, [claims, searchQuery, statusFilter, categoryFilter, dateFrom, dateTo])

    const categoryUtilization = useMemo(() => {
        return reimbursementCategories.map((cat) => {
            const catClaims = claims.filter(
                (c) => c.category === cat.name && (c.status === "Approved" || c.status === "Paid")
            )
            const utilized = catClaims.reduce((s, c) => s + c.amount, 0)
            const pendingCount = claims.filter((c) => c.category === cat.name && c.status === "Pending").length
            return {
                ...cat,
                utilized,
                pendingCount,
                claimCount: catClaims.length,
                percentage: cat.monthlyLimit > 0 ? Math.min(100, (utilized / cat.monthlyLimit) * 100) : 0,
            }
        })
    }, [reimbursementCategories, claims])

    const stats = useMemo(() => {
        return {
            total: claims.length,
            pending: claims.filter((c) => c.status === "Pending").length,
            approved: claims.filter((c) => c.status === "Approved").length,
            rejected: claims.filter((c) => c.status === "Rejected").length,
            paid: claims.filter((c) => c.status === "Paid").length,
            pendingAmount: claims.filter((c) => c.status === "Pending").reduce((s, c) => s + c.amount, 0),
            approvedAmount: claims.filter((c) => c.status === "Approved").reduce((s, c) => s + c.amount, 0),
            paidAmount: claims.filter((c) => c.status === "Paid").reduce((s, c) => s + c.amount, 0),
        }
    }, [claims])

    const hasActiveFilters =
        statusFilter !== "all" || categoryFilter !== "all" || dateFrom || dateTo

    const clearFilters = () => {
        setStatusFilter("all")
        setCategoryFilter("all")
        setDateFrom("")
        setDateTo("")
        setSearchQuery("")
    }

    // ── Selection helpers ────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visible = filteredClaims.map((c) => c.id)
        const allSel = visible.every((id) => selectedIds.includes(id))
        if (allSel) {
            setSelectedIds((prev) => prev.filter((id) => !visible.includes(id)))
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...visible])))
        }
    }

    // ── Form handlers ────────────────────────────────────
    const openAddForm = () => {
        setEditingClaim(null)
        setFormData({ ...emptyClaimForm, category: activeCategories[0]?.name ?? "Medical" })
        setReceiptFile(null)
        setFormOpen(true)
    }

    const openEditForm = (claim: ReimbursementClaim) => {
        setEditingClaim(claim)
        setFormData({
            empCode: claim.empCode,
            employeeName: claim.employeeName,
            employeeId: claim.employeeId,
            dept: claim.dept,
            category: claim.category,
            amount: claim.amount,
            description: claim.description,
            receiptUrl: claim.receiptUrl,
            receiptName: claim.receiptName,
            submittedDate: claim.submittedDate,
            status: claim.status,
            taxable: claim.taxable,
            comments: claim.comments,
            approvedBy: claim.approvedBy,
            approvedDate: claim.approvedDate,
            rejectionReason: claim.rejectionReason,
            rejectionTags: claim.rejectionTags,
            rejectedDate: claim.rejectedDate,
            paidDate: claim.paidDate,
            paidInRunId: claim.paidInRunId,
        })
        setReceiptFile(null)
        setFormOpen(true)
    }

    const handleReceiptSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max 5MB allowed.", variant: "destructive" })
            return
        }
        setReceiptFile(file)
        const url = URL.createObjectURL(file)
        setFormData((prev) => ({ ...prev, receiptUrl: url, receiptName: file.name }))
    }

    const handleSubmitForm = () => {
        if (!formData.employeeName || !formData.employeeId || formData.amount <= 0) {
            toast({
                title: "Missing fields",
                description: "Employee name, ID and a valid amount are required.",
                variant: "destructive",
            })
            return
        }
        const cat = reimbursementCategories.find((c) => c.name === formData.category)
        if (cat && formData.amount > cat.monthlyLimit) {
            const proceed = window.confirm(
                `Amount ${formatINR(formData.amount)} exceeds ${cat.name} monthly limit of ${formatINR(cat.monthlyLimit)}. Submit anyway?`
            )
            if (!proceed) return
        }
        if (editingClaim) {
            updateClaim(editingClaim.id, formData)
            toast({ title: "Claim updated", description: `${formData.employeeName}'s claim saved.` })
        } else {
            addClaim(formData)
            toast({ title: "Claim submitted", description: `${formData.employeeName}'s ${formData.category} claim logged.` })
        }
        setFormOpen(false)
        setEditingClaim(null)
    }

    const handleDelete = (id: string) => {
        const claim = claims.find((c) => c.id === id)
        deleteClaim(id)
        toast({ title: "Claim removed", description: `${claim?.employeeName ?? "Claim"} deleted.`, variant: "destructive" })
        setSelectedIds((prev) => prev.filter((s) => s !== id))
    }

    const handleApprove = (claim: ReimbursementClaim) => {
        approveClaim(claim.id, "HR Manager")
        toast({ title: "Claim approved", description: `${claim.employeeName}'s ${claim.category} claim cleared for payout.` })
    }

    const openRejectDialog = (ids: string[]) => {
        setRejectTargetIds(ids)
        setRejectionReason("")
        setRejectionTags([])
        setRejectOpen(true)
    }

    const handleRejectConfirm = () => {
        if (!rejectionReason.trim() && rejectionTags.length === 0) {
            toast({ title: "Reason required", description: "Enter a reason or pick at least one tag.", variant: "destructive" })
            return
        }
        rejectTargetIds.forEach((id) => rejectClaim(id, rejectionReason || rejectionTags.join(", "), rejectionTags))
        toast({
            title: `Rejected ${rejectTargetIds.length} claim${rejectTargetIds.length > 1 ? "s" : ""}`,
            variant: "destructive",
        })
        setRejectOpen(false)
        setRejectionReason("")
        setRejectionTags([])
        setRejectTargetIds([])
        setSelectedIds((prev) => prev.filter((id) => !rejectTargetIds.includes(id)))
    }

    const openPaidDialog = (ids: string[]) => {
        setPaidTargetIds(ids)
        setPaidRunId(payRuns[0]?.id ?? "")
        setPaidOpen(true)
    }

    const handleMarkPaidConfirm = () => {
        paidTargetIds.forEach((id) => markClaimPaid(id, paidRunId || undefined))
        toast({
            title: `Marked ${paidTargetIds.length} as paid`,
            description: paidRunId ? `Linked to pay run.` : `Standalone payout recorded.`,
        })
        setPaidOpen(false)
        setSelectedIds((prev) => prev.filter((id) => !paidTargetIds.includes(id)))
    }

    const handleBulkApprove = () => {
        if (!selectedIds.length) return
        const eligible = selectedIds.filter((id) => claims.find((c) => c.id === id)?.status === "Pending")
        if (!eligible.length) {
            toast({ title: "Nothing to approve", description: "Selected claims are not in Pending state.", variant: "destructive" })
            return
        }
        eligible.forEach((id) => approveClaim(id, "HR Manager"))
        toast({ title: `Approved ${eligible.length} claim${eligible.length > 1 ? "s" : ""}` })
        setSelectedIds([])
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        bulkDeleteClaims(selectedIds)
        toast({ title: `Deleted ${selectedIds.length} claim${selectedIds.length > 1 ? "s" : ""}`, variant: "destructive" })
        setSelectedIds([])
        setDeleteConfirmOpen(false)
    }

    const handleAddComment = () => {
        if (!selectedClaim || !commentText.trim()) return
        addClaimComment(selectedClaim.id, "HR Manager", commentText.trim())
        toast({ title: "Comment added" })
        setCommentText("")
        // Refresh selected claim view
        const updated = { ...selectedClaim, comments: [...(selectedClaim.comments ?? []), { id: `cm-${Date.now()}`, author: "HR Manager", text: commentText.trim(), timestamp: new Date().toISOString() }] }
        setSelectedClaim(updated)
    }

    // ─── Round 2 handlers ────────────────────────────────
    const handleRunOcr = (claim: ReimbursementClaim) => {
        runOcrOnClaim(claim.id)
        const updated = usePayrollStore.getState().claims.find((c) => c.id === claim.id)
        if (updated) {
            setOcrTarget(updated)
            setOcrResultOpen(true)
        }
    }

    const handleBulkOcr = () => {
        if (!selectedIds.length) return
        const result = bulkRunOcrClaims(selectedIds)
        setBulkOcrResult(result)
        toast({ title: `OCR complete on ${result.processed}`, description: "Receipts scanned for amount and vendor." })
    }

    const handleDetectDup = (claim: ReimbursementClaim) => {
        const dupId = detectDuplicateClaim(claim.id)
        if (dupId) {
            const dup = claims.find((c) => c.id === dupId)
            toast({
                title: "Duplicate detected",
                description: dup ? `Matches ${dup.employeeName}'s ${dup.category} claim on ${dup.submittedDate}.` : "Linked to earlier claim.",
                variant: "destructive",
            })
        } else {
            toast({ title: "No duplicate found", description: "Claim appears unique." })
        }
    }

    const handleBulkDetectDup = () => {
        if (!selectedIds.length) return
        const result = bulkDetectDuplicates(selectedIds)
        setBulkDupResult(result)
    }

    const handleAutoValidate = (claim: ReimbursementClaim) => {
        const result = autoValidateClaim(claim.id)
        toast({
            title: result.issues.length === 0 ? "All checks passed" : `${result.issues.length} issue${result.issues.length > 1 ? "s" : ""} flagged`,
            description: result.issues.slice(0, 2).join(" · ") || "Claim is policy-compliant.",
            variant: result.issues.length > 0 ? "destructive" : "default",
        })
    }

    const handleBulkValidate = () => {
        if (!selectedIds.length) return
        const result = bulkAutoValidateClaims(selectedIds)
        setBulkValidateResult(result)
    }

    // Policy editor
    const openPolicyEditor = (rule?: ReimbursementPolicyRule) => {
        if (rule) {
            setEditingPolicy(rule)
            setPolicyForm({
                category: rule.category,
                monthlyCap: rule.monthlyCap,
                perClaimCap: rule.perClaimCap,
                receiptRequired: rule.receiptRequired,
                autoApproveIfWithinCap: rule.autoApproveIfWithinCap ?? false,
                autoRejectIfNoReceipt: rule.autoRejectIfNoReceipt ?? false,
                mileageRatePerKm: rule.mileageRatePerKm ?? 10,
                active: rule.active,
            })
        } else {
            setEditingPolicy(null)
            setPolicyForm({
                category: activeCategories[0]?.name ?? "",
                monthlyCap: 0,
                perClaimCap: 0,
                receiptRequired: true,
                autoApproveIfWithinCap: false,
                autoRejectIfNoReceipt: false,
                mileageRatePerKm: 10,
                active: true,
            })
        }
        setPolicyOpen(true)
    }

    const handleSavePolicy = () => {
        if (!policyForm.category.trim()) {
            toast({ title: "Category required", variant: "destructive" })
            return
        }
        if (editingPolicy) {
            updateReimbursementPolicyRule(editingPolicy.id, policyForm)
            toast({ title: "Policy updated" })
        } else {
            addReimbursementPolicyRule(policyForm)
            toast({ title: "Policy rule added" })
        }
        setEditingPolicy(null)
        setPolicyForm({
            category: activeCategories[0]?.name ?? "",
            monthlyCap: 0,
            perClaimCap: 0,
            receiptRequired: true,
            autoApproveIfWithinCap: false,
            autoRejectIfNoReceipt: false,
            mileageRatePerKm: 10,
            active: true,
        })
    }

    const handleDeletePolicy = (id: string) => {
        deleteReimbursementPolicyRule(id)
        toast({ title: "Policy deleted", variant: "destructive" })
    }

    // Mileage calculator
    const openMileageCalc = () => {
        const firstRule = reimbursementPolicyRules.find((r) => r.active && r.mileageRatePerKm)
        setMileageCategory(firstRule?.category ?? activeCategories[0]?.name ?? "")
        setMileageKm(0)
        setMileageOpen(true)
    }

    const mileageResult = useMemo(() => {
        if (!mileageCategory || mileageKm <= 0) return { amount: 0, rate: 10 }
        return computeMileage(mileageKm, mileageCategory)
    }, [mileageCategory, mileageKm, computeMileage])

    const handleMileageCreateClaim = () => {
        if (mileageKm <= 0 || !mileageCategory) {
            toast({ title: "Enter distance and category", variant: "destructive" })
            return
        }
        setEditingClaim(null)
        setFormData({
            ...emptyClaimForm,
            category: mileageCategory,
            amount: mileageResult.amount,
            description: `Mileage claim · ${mileageKm} km @ ₹${mileageResult.rate}/km`,
            mileageKm,
            taxable: reimbursementCategories.find((c) => c.name === mileageCategory)?.taxable ?? false,
        })
        setReceiptFile(null)
        setMileageOpen(false)
        setFormOpen(true)
    }

    // Link duplicate manually
    const openLinkDup = (claim: ReimbursementClaim) => {
        setLinkDupTarget(claim)
        setLinkDupSelectedId(claim.duplicateOfClaimId ?? "")
        setLinkDupOpen(true)
    }

    const handleConfirmLinkDup = () => {
        if (!linkDupTarget) return
        updateClaim(linkDupTarget.id, { duplicateOfClaimId: linkDupSelectedId || undefined })
        toast({ title: linkDupSelectedId ? "Duplicate linked" : "Duplicate link cleared" })
        setLinkDupOpen(false)
        setLinkDupTarget(null)
        setLinkDupSelectedId("")
    }

    // ── Categories ─────────────────────────────────────
    const openCategoryForm = (cat?: ReimbursementCategory) => {
        if (cat) {
            setEditingCategory(cat)
            setCategoryForm({
                name: cat.name,
                monthlyLimit: cat.monthlyLimit,
                taxable: cat.taxable,
                color: cat.color,
                description: cat.description,
                active: cat.active,
            })
        } else {
            setEditingCategory(null)
            setCategoryForm({
                name: "",
                monthlyLimit: 0,
                taxable: false,
                color: "#8B5CF6",
                description: "",
                active: true,
            })
        }
        setCategoryFormOpen(true)
    }

    const handleSaveCategory = () => {
        if (!categoryForm.name.trim() || categoryForm.monthlyLimit <= 0) {
            toast({
                title: "Invalid category",
                description: "Name and a positive monthly limit are required.",
                variant: "destructive",
            })
            return
        }
        if (editingCategory) {
            updateReimbursementCategory(editingCategory.id, categoryForm)
            toast({ title: "Category updated", description: `${categoryForm.name} saved.` })
        } else {
            addReimbursementCategory(categoryForm)
            toast({ title: "Category added", description: `${categoryForm.name} created.` })
        }
        setCategoryFormOpen(false)
        setEditingCategory(null)
    }

    const handleDeleteCategory = () => {
        if (!categoryDeleteTarget) return
        const cat = reimbursementCategories.find((c) => c.id === categoryDeleteTarget)
        const inUse = claims.some((c) => c.category === cat?.name)
        if (inUse) {
            toast({
                title: "Cannot delete",
                description: `${cat?.name} is used by existing claims. Deactivate instead.`,
                variant: "destructive",
            })
            setCategoryDeleteOpen(false)
            return
        }
        deleteReimbursementCategory(categoryDeleteTarget)
        toast({ title: "Category removed", variant: "destructive" })
        setCategoryDeleteOpen(false)
        setCategoryDeleteTarget(null)
    }

    // ── Export ──────────────────────────────────────────
    const handleExportCsv = () => {
        if (!claims.length) {
            toast({ title: "No data", description: "Nothing to export.", variant: "destructive" })
            return
        }
        const headers = [
            "Emp Code", "Name", "Department", "Category", "Amount", "Description",
            "Submitted", "Status", "Approved By", "Approved Date", "Rejected Date",
            "Rejection Reason", "Paid Date", "Paid In Run", "Taxable",
        ]
        const source = filteredClaims.length ? filteredClaims : claims
        const rows = source.map((c) => [
            c.empCode ?? c.employeeId,
            `"${c.employeeName}"`,
            c.dept ?? "",
            c.category,
            c.amount,
            `"${(c.description ?? "").replace(/"/g, "'")}"`,
            c.submittedDate,
            c.status,
            c.approvedBy ?? "",
            c.approvedDate ?? "",
            c.rejectedDate ?? "",
            `"${(c.rejectionReason ?? "").replace(/"/g, "'")}"`,
            c.paidDate ?? "",
            c.paidInRunId ?? "",
            c.taxable ? "Yes" : "No",
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `reimbursements_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${source.length} claim${source.length > 1 ? "s" : ""} downloaded.` })
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* ── Header ────────────────────────────── */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Wallet size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Reimbursements</h1>
                            <p className="text-xs font-medium text-slate-500">Claims, approvals & policy compliance</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCategoryPolicyOpen(true)}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <ShieldCheck size={14} /> <span className="hidden md:inline">Policy engine</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openPolicyEditor()}
                            className="h-9 rounded-lg border-[#8B5CF6]/30 bg-[#8B5CF6]/5 font-semibold text-xs gap-2 px-3 hover:bg-[#8B5CF6]/10 text-[#8B5CF6]"
                        >
                            <ShieldAlert size={14} /> <span className="hidden md:inline">Policy rules ({reimbursementPolicyRules.length})</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openMileageCalc()}
                            className="h-9 rounded-lg border-[#8B5CF6]/30 bg-[#8B5CF6]/5 font-semibold text-xs gap-2 px-3 hover:bg-[#8B5CF6]/10 text-[#8B5CF6]"
                        >
                            <Route size={14} /> <span className="hidden md:inline">Mileage calc</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportCsv}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export CSV</span>
                        </Button>
                        <Button
                            onClick={openAddForm}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            <Plus size={14} /> <span className="hidden md:inline">New claim</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* ── Stats ──────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Pending" value={String(stats.pending)} caption={formatINR(stats.pendingAmount)} icon={Clock} color="#F59E0B" />
                            <StatCard label="Approved" value={String(stats.approved)} caption={formatINR(stats.approvedAmount)} icon={CheckCircle2} color="#10B981" />
                            <StatCard label="Paid" value={String(stats.paid)} caption={formatINR(stats.paidAmount)} icon={Banknote} color="#8B5CF6" />
                            <StatCard label="Rejected" value={String(stats.rejected)} caption={`${stats.total} total claims`} icon={XCircle} color="#F43F5E" />
                        </div>

                        {/* ── Category utilization ──────── */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">Category budget utilisation</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        Monthly limits and current consumption per category.
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openCategoryForm()}
                                    className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-2"
                                >
                                    <Plus size={14} /> Add category
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 lg:p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {categoryUtilization.filter((c) => c.active).map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                                                    <Receipt size={16} />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-md text-slate-400 hover:text-slate-700">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem onClick={() => openCategoryForm(cat)} className="cursor-pointer text-xs font-medium">
                                                            <Edit size={13} className="mr-2" /> Edit limits
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => updateReimbursementCategory(cat.id, { active: !cat.active })}
                                                            className="cursor-pointer text-xs font-medium"
                                                        >
                                                            {cat.active ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => { setCategoryDeleteTarget(cat.id); setCategoryDeleteOpen(true) }}
                                                            className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600"
                                                        >
                                                            <Trash2 size={13} className="mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-baseline gap-2">
                                                    <div className="text-sm font-bold text-slate-900 truncate">{cat.name}</div>
                                                    {cat.taxable && <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-bold px-1.5 py-0.5">Taxable</Badge>}
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(cat.utilized)}</span>
                                                    <span className="text-[11px] font-medium text-slate-400">/ {formatINR(cat.monthlyLimit)}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${cat.percentage}%` }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: cat.color }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] font-medium text-slate-500">
                                                    <span>{Math.round(cat.percentage)}% used</span>
                                                    {cat.pendingCount > 0 && <span className="text-amber-600 font-semibold">{cat.pendingCount} pending</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Claims table ──────────────── */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">Verification queue</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        {filteredClaims.length} of {claims.length} claims
                                    </CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative flex-1 min-w-[200px] lg:w-56 lg:flex-none">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search name, dept, category..."
                                            className="pl-9 h-9 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                        />
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn("h-9 rounded-lg font-semibold text-xs gap-2",
                                                    hasActiveFilters
                                                        ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5"
                                                        : "border-slate-200 text-slate-600")}
                                            >
                                                <Filter size={14} /> Filters
                                                {hasActiveFilters && (
                                                    <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold h-4 px-1.5">
                                                        {[statusFilter !== "all", categoryFilter !== "all", !!dateFrom, !!dateTo].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-72 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-900">Filter claims</h4>
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
                                                        <SelectItem value="Approved">Approved</SelectItem>
                                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                                        <SelectItem value="Paid">Paid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Category</Label>
                                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All categories</SelectItem>
                                                        {activeCategories.map((c) => (
                                                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-semibold text-slate-600">From</Label>
                                                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 text-xs" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-semibold text-slate-600">To</Label>
                                                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 text-xs" />
                                                </div>
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
                                                <Button size="sm" onClick={() => openRejectDialog(selectedIds)} className="h-7 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold px-3 rounded-md border-none">
                                                    <XCircle size={12} className="mr-1" /> Reject
                                                </Button>
                                                <Button size="sm" onClick={() => openPaidDialog(selectedIds.filter((id) => claims.find((c) => c.id === id)?.status === "Approved"))} className="h-7 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white text-[11px] font-semibold px-3 rounded-md border-none">
                                                    <Banknote size={12} className="mr-1" /> Mark paid
                                                </Button>
                                                <Button size="sm" onClick={handleBulkOcr} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                                    <ScanLine size={12} className="mr-1" /> Run OCR
                                                </Button>
                                                <Button size="sm" onClick={handleBulkDetectDup} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-rose-200 text-rose-600 hover:bg-rose-50">
                                                    <Copy size={12} className="mr-1" /> Detect dups
                                                </Button>
                                                <Button size="sm" onClick={handleBulkValidate} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                                    <Wand2 size={12} className="mr-1" /> Auto-validate
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
                                                        checked={filteredClaims.length > 0 && filteredClaims.every((c) => selectedIds.includes(c.id))}
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={filteredClaims.length === 0}
                                                        className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                    />
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Category</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Amount</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Submitted</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredClaims.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                        {claims.length === 0 ? "No claims yet. Click 'New claim' to add one." : "No claims match the current filters."}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredClaims.map((claim) => {
                                                    const cat = reimbursementCategories.find((c) => c.name === claim.category)
                                                    return (
                                                        <TableRow
                                                            key={claim.id}
                                                            onClick={() => setSelectedClaim(claim)}
                                                            className={cn("group border-slate-50 cursor-pointer", selectedIds.includes(claim.id) ? "bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10" : "hover:bg-slate-50/70")}
                                                        >
                                                            <TableCell className="pl-6 py-3" onClick={(e) => e.stopPropagation()}>
                                                                <Checkbox
                                                                    checked={selectedIds.includes(claim.id)}
                                                                    onCheckedChange={() => toggleSelect(claim.id)}
                                                                    className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                        {claim.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-sm font-semibold text-slate-900 truncate">{claim.employeeName}</div>
                                                                        <div className="text-[11px] font-medium text-slate-500 truncate">
                                                                            {claim.empCode ?? claim.employeeId}{claim.dept ? ` • ${claim.dept}` : ""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <Badge
                                                                    className="border-none text-[10px] font-semibold px-2 py-0.5"
                                                                    style={{ backgroundColor: `${cat?.color ?? "#64748b"}20`, color: cat?.color ?? "#64748b" }}
                                                                >
                                                                    {claim.category}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-3 text-sm font-bold text-slate-900 tabular-nums">{formatINR(claim.amount)}</TableCell>
                                                            <TableCell className="py-3 text-[11px] font-medium text-slate-500">{claim.submittedDate}</TableCell>
                                                            <TableCell className="py-3">
                                                                <div className="flex flex-col gap-1">
                                                                    <Badge className={cn("w-fit border-none text-[10px] font-semibold px-2 py-0.5",
                                                                        claim.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                                            claim.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                                                claim.status === "Paid" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                                                    "bg-amber-50 text-amber-600")}>
                                                                        {claim.status}
                                                                    </Badge>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {claim.receiptOcr && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <ScanLine size={9} /> OCR {Math.round(claim.receiptOcr.confidence * 100)}%
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    Detected {formatINR(claim.receiptOcr.detectedAmount ?? 0)}
                                                                                    {claim.receiptOcr.detectedVendor ? ` · ${claim.receiptOcr.detectedVendor}` : ""}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {claim.duplicateOfClaimId && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <Copy size={9} /> Dup
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    {(() => {
                                                                                        const d = claims.find((x) => x.id === claim.duplicateOfClaimId)
                                                                                        return d ? `Matches ${d.employeeName} · ${d.category} · ${d.submittedDate}` : "Linked duplicate"
                                                                                    })()}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {claim.validationIssues && claim.validationIssues.length > 0 && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <FileWarning size={9} /> {claim.validationIssues.length}
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>{claim.validationIssues.join(" · ")}</TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {claim.autoValidated && (!claim.validationIssues || claim.validationIssues.length === 0) && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <Check size={9} /> Clean
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Passed all policy checks</TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6 py-3">
                                                                <div className="flex justify-end gap-1">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => { setSelectedClaim(claim); setDetailOpen(true) }}
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
                                                                            {claim.status === "Pending" && (
                                                                                <>
                                                                                    <DropdownMenuItem onClick={() => handleApprove(claim)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                        <CheckCircle2 size={13} className="mr-2" /> Approve
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => openRejectDialog([claim.id])} className="cursor-pointer text-xs font-medium text-rose-600">
                                                                                        <XCircle size={13} className="mr-2" /> Reject
                                                                                    </DropdownMenuItem>
                                                                                </>
                                                                            )}
                                                                            {claim.status === "Approved" && (
                                                                                <DropdownMenuItem onClick={() => openPaidDialog([claim.id])} className="cursor-pointer text-xs font-medium text-[#8B5CF6]">
                                                                                    <Banknote size={13} className="mr-2" /> Mark paid
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuItem onClick={() => openEditForm(claim)} className="cursor-pointer text-xs font-medium">
                                                                                <Edit size={13} className="mr-2" /> Edit
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => { setSelectedClaim(claim); setDetailOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                                <MessageSquare size={13} className="mr-2" /> Comments
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI & audit</DropdownMenuLabel>
                                                                            <DropdownMenuItem onClick={() => handleRunOcr(claim)} className="cursor-pointer text-xs font-medium text-indigo-600">
                                                                                <ScanLine size={13} className="mr-2" /> Run OCR
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleDetectDup(claim)} className="cursor-pointer text-xs font-medium text-rose-600">
                                                                                <Copy size={13} className="mr-2" /> Detect duplicate
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleAutoValidate(claim)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                <Wand2 size={13} className="mr-2" /> Auto-validate
                                                                            </DropdownMenuItem>
                                                                            {claim.duplicateOfClaimId && (
                                                                                <DropdownMenuItem onClick={() => openLinkDup(claim)} className="cursor-pointer text-xs font-medium text-slate-600">
                                                                                    <Link2 size={13} className="mr-2" /> Link duplicate
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem onClick={() => handleDelete(claim.id)} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
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

                {/* ── Add / Edit Claim Dialog ─────────── */}
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingClaim ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingClaim ? "Edit claim" : "New reimbursement claim"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {editingClaim ? "Update the claim details below." : "Submit on behalf of an employee or for off-cycle expense."}
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
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
                                        <FormField label="Department">
                                            <Input value={formData.dept ?? ""} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claim</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Category" required>
                                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v, taxable: reimbursementCategories.find((c) => c.name === v)?.taxable ?? false })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {activeCategories.map((c) => (
                                                        <SelectItem key={c.id} value={c.name}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                                                                {c.name} • cap {formatINR(c.monthlyLimit)}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Amount (₹)" required>
                                            <Input type="number" value={formData.amount || ""} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} placeholder="0" className="h-10 text-sm font-semibold tabular-nums" />
                                        </FormField>
                                        <FormField label="Submitted date">
                                            <Input type="date" value={formData.submittedDate} onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Taxable">
                                            <div className="h-10 flex items-center gap-3 bg-slate-50 rounded-lg px-3 border border-slate-200">
                                                <Switch checked={formData.taxable} onCheckedChange={(v) => setFormData({ ...formData, taxable: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                                                <span className="text-xs font-medium text-slate-600">{formData.taxable ? "Yes" : "No"}</span>
                                            </div>
                                        </FormField>
                                    </div>
                                    <FormField label="Description">
                                        <Textarea value={formData.description ?? ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Purpose, location, other context..." className="min-h-[70px] text-sm font-medium" />
                                    </FormField>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receipt</h4>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleReceiptSelect}
                                        className="hidden"
                                    />
                                    {formData.receiptName ? (
                                        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                                            <FileText size={16} className="text-emerald-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-800 truncate">{formData.receiptName}</div>
                                                <div className="text-[11px] font-medium text-slate-500">Uploaded</div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => { setReceiptFile(null); setFormData({ ...formData, receiptName: undefined, receiptUrl: undefined }) }} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500">
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-10 border-dashed border-slate-300 text-slate-500 font-semibold text-xs gap-2">
                                            <Upload size={14} /> Upload receipt (PDF or image, max 5MB)
                                        </Button>
                                    )}
                                </section>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                            <Button variant="ghost" onClick={() => setFormOpen(false)} className="h-10 px-5 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSubmitForm} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs border-none">
                                {editingClaim ? "Save changes" : "Submit claim"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Detail Sheet ────────────────────── */}
                <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                    <SheetContent className="sm:max-w-xl p-0 font-sans">
                        {selectedClaim && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-50 p-6 border-b border-slate-100 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Badge
                                                className="border-none text-[10px] font-semibold px-2 py-0.5 mb-2 w-fit"
                                                style={{
                                                    backgroundColor: `${reimbursementCategories.find((c) => c.name === selectedClaim.category)?.color ?? "#64748b"}20`,
                                                    color: reimbursementCategories.find((c) => c.name === selectedClaim.category)?.color ?? "#64748b",
                                                }}
                                            >
                                                {selectedClaim.category}
                                            </Badge>
                                            <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">
                                                {selectedClaim.employeeName}
                                            </SheetTitle>
                                            <SheetDescription className="text-[11px] font-medium text-slate-500 truncate">
                                                {selectedClaim.empCode ?? selectedClaim.employeeId} • {selectedClaim.dept ?? "—"} • Trace: {selectedClaim.id.slice(-8)}
                                            </SheetDescription>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Amount</div>
                                            <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(selectedClaim.amount)}</div>
                                            <Badge className={cn("mt-1 border-none text-[10px] font-semibold px-2",
                                                selectedClaim.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                    selectedClaim.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                        selectedClaim.status === "Paid" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                            "bg-amber-50 text-amber-600")}>
                                                {selectedClaim.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-5">
                                        {selectedClaim.description && (
                                            <section>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</div>
                                                <p className="text-sm text-slate-700 leading-relaxed">{selectedClaim.description}</p>
                                            </section>
                                        )}

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Receipt</div>
                                            {selectedClaim.receiptName ? (
                                                <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50">
                                                    <FileText size={22} className="text-emerald-600 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-slate-800 truncate">{selectedClaim.receiptName}</div>
                                                        <div className="text-[11px] font-medium text-slate-500">Uploaded on {selectedClaim.submittedDate}</div>
                                                    </div>
                                                    {selectedClaim.receiptUrl && (
                                                        <a
                                                            href={selectedClaim.receiptUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="h-8 px-3 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg flex items-center gap-1.5 text-slate-700 hover:bg-slate-50"
                                                        >
                                                            <Eye size={12} /> View
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-3 p-4 border border-amber-100 rounded-xl bg-amber-50">
                                                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                                    <p className="text-xs font-semibold text-amber-800">No receipt attached. Consider rejecting unless policy allows.</p>
                                                </div>
                                            )}
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Policy & timeline</div>
                                            <div className="space-y-2">
                                                <PolicyRow label="Taxable" value={selectedClaim.taxable ? "Yes" : "No"} />
                                                <PolicyRow label="Submitted" value={selectedClaim.submittedDate} />
                                                {selectedClaim.approvedDate && <PolicyRow label="Approved" value={`${selectedClaim.approvedDate}${selectedClaim.approvedBy ? ` by ${selectedClaim.approvedBy}` : ""}`} valueColor="text-emerald-600" />}
                                                {selectedClaim.rejectedDate && <PolicyRow label="Rejected" value={selectedClaim.rejectedDate} valueColor="text-rose-600" />}
                                                {selectedClaim.paidDate && <PolicyRow label="Paid" value={`${selectedClaim.paidDate}${selectedClaim.paidInRunId ? ` (via ${payRuns.find((r) => r.id === selectedClaim.paidInRunId)?.month ?? "pay run"})` : ""}`} valueColor="text-[#8B5CF6]" />}
                                                <PolicyRow
                                                    label="Within monthly cap"
                                                    value={(() => {
                                                        const cat = reimbursementCategories.find((c) => c.name === selectedClaim.category)
                                                        if (!cat) return "Unknown"
                                                        return selectedClaim.amount <= cat.monthlyLimit ? `Yes (${formatINR(cat.monthlyLimit)})` : `Exceeds cap ${formatINR(cat.monthlyLimit)}`
                                                    })()}
                                                    valueColor={(() => {
                                                        const cat = reimbursementCategories.find((c) => c.name === selectedClaim.category)
                                                        return cat && selectedClaim.amount > cat.monthlyLimit ? "text-rose-600" : "text-slate-800"
                                                    })()}
                                                />
                                            </div>
                                        </section>

                                        {selectedClaim.rejectionReason && (
                                            <section>
                                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Rejection</div>
                                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 space-y-2">
                                                    <p className="text-xs font-semibold text-rose-800 leading-relaxed">{selectedClaim.rejectionReason}</p>
                                                    {selectedClaim.rejectionTags && selectedClaim.rejectionTags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {selectedClaim.rejectionTags.map((t) => (
                                                                <Badge key={t} className="bg-white text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5">{t}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                        )}

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Comments ({selectedClaim.comments?.length ?? 0})
                                            </div>
                                            <div className="space-y-2 mb-3">
                                                {(selectedClaim.comments ?? []).length === 0 && (
                                                    <p className="text-xs text-slate-400 italic">No comments yet.</p>
                                                )}
                                                {(selectedClaim.comments ?? []).map((cm) => (
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
                                    {selectedClaim.status === "Pending" && (
                                        <>
                                            <Button
                                                onClick={() => { handleApprove(selectedClaim); setDetailOpen(false) }}
                                                className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none"
                                            >
                                                <CheckCircle2 size={13} className="mr-1.5" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => { openRejectDialog([selectedClaim.id]); setDetailOpen(false) }}
                                                variant="outline"
                                                className="flex-1 h-10 text-rose-500 border-rose-200 font-bold text-xs hover:bg-rose-50"
                                            >
                                                <XCircle size={13} className="mr-1.5" /> Reject
                                            </Button>
                                        </>
                                    )}
                                    {selectedClaim.status === "Approved" && (
                                        <Button
                                            onClick={() => { openPaidDialog([selectedClaim.id]); setDetailOpen(false) }}
                                            className="flex-1 h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none"
                                        >
                                            <Banknote size={13} className="mr-1.5" /> Mark as paid
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => { openEditForm(selectedClaim); setDetailOpen(false) }}
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

                {/* ── Reject Dialog ──────────────────── */}
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <XCircle size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Reject {rejectTargetIds.length > 1 ? `${rejectTargetIds.length} claims` : "claim"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Provide a reason so the employee knows what to correct.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Reason">
                                <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Receipt is illegible / amount exceeds category limit" className="min-h-[80px] text-xs font-medium" />
                            </FormField>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Tags (optional)</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {REJECTION_TAGS.map((tag) => {
                                        const active = rejectionTags.includes(tag)
                                        return (
                                            <Badge
                                                key={tag}
                                                onClick={() => setRejectionTags((prev) => active ? prev.filter((t) => t !== tag) : [...prev, tag])}
                                                className={cn("cursor-pointer text-[10px] font-semibold px-2 py-1 border",
                                                    active ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100")}
                                            >
                                                {tag}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setRejectOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleRejectConfirm} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Confirm reject
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Mark Paid Dialog ───────────────── */}
                <Dialog open={paidOpen} onOpenChange={setPaidOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Banknote size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Mark {paidTargetIds.length > 1 ? `${paidTargetIds.length} claims` : "claim"} as paid
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Optionally link to a pay run cycle for audit trail.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Link to pay run (optional)">
                                <Select value={paidRunId || "none"} onValueChange={(v) => setPaidRunId(v === "none" ? "" : v)}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Standalone payout (no run)</SelectItem>
                                        {payRuns.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>{r.month} • {r.status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <div className="flex items-start gap-3 p-3 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/10">
                                <AlertCircle size={16} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                                <p className="text-xs font-semibold text-[#8B5CF6]">
                                    Paid claims are locked — they can still be viewed and commented but not edited.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPaidOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleMarkPaidConfirm} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <Banknote size={13} className="mr-1.5" /> Mark paid
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Delete Confirm ────────────── */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete {selectedIds.length} claim{selectedIds.length > 1 ? "s" : ""}?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleBulkDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Policy Engine Sheet (category caps) ────────────── */}
                <Sheet open={categoryPolicyOpen} onOpenChange={setCategoryPolicyOpen}>
                    <SheetContent className="sm:max-w-lg p-0 font-sans">
                        <div className="h-full flex flex-col bg-white">
                            <SheetHeader className="bg-[#8B5CF6] p-6 text-white space-y-1">
                                <Badge className="bg-white/20 text-white border-none font-semibold text-[10px] px-2 py-0.5 w-fit mb-2">
                                    Governance
                                </Badge>
                                <SheetTitle className="text-xl font-bold text-white tracking-tight">Reimbursement policy</SheetTitle>
                                <SheetDescription className="text-white/80 font-medium text-[11px]">
                                    Edit category limits and taxability. Changes apply immediately to new validations.
                                </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="flex-1 p-5">
                                <div className="space-y-3">
                                    {reimbursementCategories.map((cat) => (
                                        <div key={cat.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                                                        <Receipt size={14} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                                                        <p className="text-[11px] font-medium text-slate-500 truncate max-w-[250px]">{cat.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cn("border-none text-[10px] font-semibold", cat.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                        {cat.active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Monthly limit</Label>
                                                    <Input
                                                        type="number"
                                                        value={cat.monthlyLimit}
                                                        onChange={(e) => updateReimbursementCategory(cat.id, { monthlyLimit: parseFloat(e.target.value) || 0 })}
                                                        className="h-9 text-sm font-semibold tabular-nums"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Taxable</Label>
                                                    <div className="h-9 flex items-center gap-2 bg-slate-50 rounded-md px-3 border border-slate-200">
                                                        <Switch
                                                            checked={cat.taxable}
                                                            onCheckedChange={(v) => updateReimbursementCategory(cat.id, { taxable: v })}
                                                            className="data-[state=checked]:bg-[#8B5CF6]"
                                                        />
                                                        <span className="text-xs font-medium text-slate-600">{cat.taxable ? "Yes" : "No"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2 border-t border-slate-100">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openCategoryForm(cat)}
                                                    className="flex-1 h-8 text-[11px] font-semibold gap-1 border-slate-200"
                                                >
                                                    <Edit size={12} /> Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateReimbursementCategory(cat.id, { active: !cat.active })}
                                                    className="flex-1 h-8 text-[11px] font-semibold border-slate-200"
                                                >
                                                    {cat.active ? "Deactivate" : "Activate"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => { setCategoryDeleteTarget(cat.id); setCategoryDeleteOpen(true) }}
                                                    className="h-8 w-8 p-0 text-rose-500 border-rose-200 hover:bg-rose-50"
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => openCategoryForm()}
                                    variant="outline"
                                    className="w-full mt-4 h-10 border-dashed border-[#8B5CF6] text-[#8B5CF6] font-semibold text-xs gap-2"
                                >
                                    <Plus size={14} /> Add new category
                                </Button>
                            </ScrollArea>
                            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                                <Button onClick={() => { setCategoryPolicyOpen(false); toast({ title: "Policy saved", description: "Changes applied to future claims." }) }} className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none">
                                    <ShieldCheck size={13} className="mr-1.5" /> Done
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* ── Category Add/Edit ─────────────── */}
                <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingCategory ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingCategory ? "Edit category" : "New category"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Define a reimbursement category with monthly cap and taxability.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Name" required>
                                <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="Education, Books, etc." />
                            </FormField>
                            <FormField label="Description">
                                <Textarea value={categoryForm.description ?? ""} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="min-h-[60px] text-xs font-medium" placeholder="What kinds of expenses fall here?" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Monthly limit (₹)" required>
                                    <Input type="number" value={categoryForm.monthlyLimit || ""} onChange={(e) => setCategoryForm({ ...categoryForm, monthlyLimit: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                                <FormField label="Colour">
                                    <div className="flex gap-2 items-center">
                                        <Input type="color" value={categoryForm.color} onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })} className="h-10 w-14 p-1 cursor-pointer" />
                                        <Input value={categoryForm.color} onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })} className="h-10 text-sm font-mono" />
                                    </div>
                                </FormField>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Taxable category</Label>
                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Reimbursements in this category will be added to taxable income.</p>
                                </div>
                                <Switch checked={categoryForm.taxable} onCheckedChange={(v) => setCategoryForm({ ...categoryForm, taxable: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Active</Label>
                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Inactive categories can't be selected for new claims.</p>
                                </div>
                                <Switch checked={categoryForm.active} onCheckedChange={(v) => setCategoryForm({ ...categoryForm, active: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCategoryFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveCategory} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingCategory ? "Save" : "Create category"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Category Delete Confirm ──────── */}
                <Dialog open={categoryDeleteOpen} onOpenChange={setCategoryDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete category?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Categories with existing claims cannot be deleted — deactivate them instead.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCategoryDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteCategory} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── OCR Result ─────────── */}
                <Dialog open={ocrResultOpen} onOpenChange={setOcrResultOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2">
                                <ScanLine size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">OCR Extraction</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Extracted fields from {ocrTarget?.receiptName ?? "receipt"}.
                            </DialogDescription>
                        </DialogHeader>
                        {ocrTarget?.receiptOcr && (
                            <div className="mt-4 space-y-3">
                                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Confidence</div>
                                        <div className="text-2xl font-bold text-indigo-700 tabular-nums">
                                            {Math.round(ocrTarget.receiptOcr.confidence * 100)}%
                                        </div>
                                    </div>
                                    <Sparkles size={32} className="text-indigo-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Declared</div>
                                        <div className="text-sm font-bold text-slate-800 tabular-nums">{formatINR(ocrTarget.amount)}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detected</div>
                                        <div className="text-sm font-bold text-indigo-700 tabular-nums">{formatINR(ocrTarget.receiptOcr.detectedAmount ?? 0)}</div>
                                    </div>
                                </div>
                                {(() => {
                                    const declared = ocrTarget.amount
                                    const detected = ocrTarget.receiptOcr.detectedAmount ?? 0
                                    if (!declared || !detected) return null
                                    const diffPct = Math.abs(declared - detected) / declared
                                    if (diffPct > 0.1) {
                                        return (
                                            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-[11px] font-semibold text-amber-800">
                                                    Declared and detected amounts differ by {Math.round(diffPct * 100)}%. Review the receipt.
                                                </p>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                            <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-semibold text-emerald-800">Amounts are within 10% tolerance.</p>
                                        </div>
                                    )
                                })()}
                                {ocrTarget.receiptOcr.detectedVendor && (
                                    <PolicyRow label="Vendor" value={ocrTarget.receiptOcr.detectedVendor} />
                                )}
                                {ocrTarget.receiptOcr.detectedDate && (
                                    <PolicyRow label="Date" value={ocrTarget.receiptOcr.detectedDate} />
                                )}
                                {ocrTarget.receiptOcr.detectedCategory && (
                                    <PolicyRow label="Category hint" value={ocrTarget.receiptOcr.detectedCategory} />
                                )}
                                {ocrTarget.receiptOcr.rawText && (
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Raw extract</div>
                                        <div className="p-2 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap">
                                            {ocrTarget.receiptOcr.rawText}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setOcrResultOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            {ocrTarget && (
                                <Button onClick={() => { handleAutoValidate(ocrTarget); setOcrResultOpen(false) }} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                    <Wand2 size={13} /> Validate now
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk OCR Result ─────────── */}
                <Dialog open={!!bulkOcrResult} onOpenChange={(o) => !o && setBulkOcrResult(null)}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2">
                                <ScanLine size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">OCR batch complete</DialogTitle>
                        </DialogHeader>
                        {bulkOcrResult && (
                            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                                <div className="text-4xl font-bold text-indigo-700 tabular-nums">{bulkOcrResult.processed}</div>
                                <div className="text-xs font-semibold text-indigo-600 mt-1">receipts scanned</div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkOcrResult(null)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Duplicate Result ─────────── */}
                <Dialog open={!!bulkDupResult} onOpenChange={(o) => !o && setBulkDupResult(null)}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-2">
                                <Copy size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Duplicate scan</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Claims matched against earlier submissions.
                            </DialogDescription>
                        </DialogHeader>
                        {bulkDupResult && (
                            <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
                                <div className="text-4xl font-bold text-rose-600 tabular-nums">{bulkDupResult.duplicates}</div>
                                <div className="text-xs font-semibold text-rose-700 mt-1">potential duplicates detected</div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkDupResult(null)} className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-10 font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Validate Result ─────────── */}
                <Dialog open={!!bulkValidateResult} onOpenChange={(o) => !o && setBulkValidateResult(null)}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                                <Wand2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Auto-validation</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Claims run through policy engine.
                            </DialogDescription>
                        </DialogHeader>
                        {bulkValidateResult && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-emerald-600 tabular-nums">{bulkValidateResult.validated}</div>
                                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-1">Clean</div>
                                </div>
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-amber-600 tabular-nums">{bulkValidateResult.flagged}</div>
                                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-1">Flagged</div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkValidateResult(null)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10 font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Mileage Calculator ─────────── */}
                <Dialog open={mileageOpen} onOpenChange={setMileageOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Route size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Mileage calculator</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Rates pulled from active policy rules. Default ₹10 per km.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Category" required>
                                <Select value={mileageCategory} onValueChange={setMileageCategory}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Pick category" /></SelectTrigger>
                                    <SelectContent>
                                        {reimbursementPolicyRules.filter((r) => r.active).map((r) => (
                                            <SelectItem key={r.id} value={r.category}>
                                                {r.category} · ₹{r.mileageRatePerKm ?? 10}/km
                                            </SelectItem>
                                        ))}
                                        {reimbursementPolicyRules.filter((r) => r.active).length === 0 && activeCategories.map((c) => (
                                            <SelectItem key={c.id} value={c.name}>{c.name} · ₹10/km</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Distance (km)" required>
                                <Input
                                    type="number"
                                    value={mileageKm || ""}
                                    onChange={(e) => setMileageKm(parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    className="h-10 text-sm font-semibold tabular-nums"
                                />
                            </FormField>
                            <div className="p-4 bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 rounded-xl">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">Computed amount</div>
                                        <div className="text-2xl font-bold text-[#8B5CF6] tabular-nums">{formatINR(mileageResult.amount)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Rate</div>
                                        <div className="text-sm font-bold text-slate-800 tabular-nums">₹{mileageResult.rate}/km</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setMileageOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            <Button
                                onClick={handleMileageCreateClaim}
                                disabled={mileageKm <= 0 || !mileageCategory}
                                className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2 disabled:opacity-50"
                            >
                                <Plus size={13} /> Create claim
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Link Duplicate Dialog ─────────── */}
                <Dialog open={linkDupOpen} onOpenChange={setLinkDupOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-2">
                                <Link2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Link duplicate</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Manually mark this claim as a duplicate of another.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Original claim">
                                <Select value={linkDupSelectedId || "none"} onValueChange={(v) => setLinkDupSelectedId(v === "none" ? "" : v)}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">— No link —</SelectItem>
                                        {claims
                                            .filter((c) => c.id !== linkDupTarget?.id && c.employeeId === linkDupTarget?.employeeId)
                                            .map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.category} · {formatINR(c.amount)} · {c.submittedDate}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setLinkDupOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmLinkDup} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Policy Rules Editor ─────────── */}
                <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[88vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <ShieldAlert size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Reimbursement policy rules</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Auto-validation runs these rules on every claim. Monthly caps, per-claim caps, receipt rules and mileage rates.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {/* Existing rules list */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Existing rules ({reimbursementPolicyRules.length})</h4>
                                    {reimbursementPolicyRules.length === 0 ? (
                                        <p className="text-xs font-medium text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center">No policy rules yet.</p>
                                    ) : (
                                        reimbursementPolicyRules.map((rule) => (
                                            <div key={rule.id} className={cn("p-3 rounded-xl border flex items-center justify-between gap-3",
                                                rule.active ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60")}>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-bold">{rule.category}</Badge>
                                                        {rule.receiptRequired && <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-semibold">Receipt required</Badge>}
                                                        {rule.autoApproveIfWithinCap && <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-semibold">Auto-approve</Badge>}
                                                        {rule.autoRejectIfNoReceipt && <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-semibold">Auto-reject</Badge>}
                                                    </div>
                                                    <div className="text-[11px] font-medium text-slate-600 mt-1 flex flex-wrap gap-x-3">
                                                        <span>Monthly: <span className="font-bold tabular-nums">{rule.monthlyCap > 0 ? formatINR(rule.monthlyCap) : "No cap"}</span></span>
                                                        <span>Per claim: <span className="font-bold tabular-nums">{rule.perClaimCap > 0 ? formatINR(rule.perClaimCap) : "No cap"}</span></span>
                                                        {rule.mileageRatePerKm ? <span>₹{rule.mileageRatePerKm}/km</span> : null}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button variant="ghost" size="sm" onClick={() => openPolicyEditor(rule)} className="h-7 w-7 p-0 rounded-md text-slate-500 hover:text-[#8B5CF6]">
                                                        <Edit size={13} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeletePolicy(rule.id)} className="h-7 w-7 p-0 rounded-md text-slate-500 hover:text-rose-500">
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Editor */}
                                <div className="pt-4 border-t border-slate-100 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {editingPolicy ? "Edit rule" : "Add new rule"}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Category" required>
                                            <Select value={policyForm.category} onValueChange={(v) => setPolicyForm({ ...policyForm, category: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Pick category" /></SelectTrigger>
                                                <SelectContent>
                                                    {reimbursementCategories.map((c) => (
                                                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Mileage rate (₹/km)">
                                            <Input
                                                type="number"
                                                value={policyForm.mileageRatePerKm ?? 0}
                                                onChange={(e) => setPolicyForm({ ...policyForm, mileageRatePerKm: parseFloat(e.target.value) || 0 })}
                                                className="h-10 text-sm font-semibold tabular-nums"
                                            />
                                        </FormField>
                                        <FormField label="Monthly cap (₹, 0 for none)">
                                            <Input
                                                type="number"
                                                value={policyForm.monthlyCap}
                                                onChange={(e) => setPolicyForm({ ...policyForm, monthlyCap: parseFloat(e.target.value) || 0 })}
                                                className="h-10 text-sm font-semibold tabular-nums"
                                            />
                                        </FormField>
                                        <FormField label="Per-claim cap (₹, 0 for none)">
                                            <Input
                                                type="number"
                                                value={policyForm.perClaimCap}
                                                onChange={(e) => setPolicyForm({ ...policyForm, perClaimCap: parseFloat(e.target.value) || 0 })}
                                                className="h-10 text-sm font-semibold tabular-nums"
                                            />
                                        </FormField>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.receiptRequired}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, receiptRequired: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Receipt required</div>
                                                <div className="text-[10px] font-medium text-slate-500">Claim must have an attached receipt.</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.autoApproveIfWithinCap ?? false}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, autoApproveIfWithinCap: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Auto-approve within cap</div>
                                                <div className="text-[10px] font-medium text-slate-500">Pass claims with receipt and amount inside per-claim cap.</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.autoRejectIfNoReceipt ?? false}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, autoRejectIfNoReceipt: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Flag when no receipt</div>
                                                <div className="text-[10px] font-medium text-slate-500">Add validation issue when the receipt is missing.</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.active}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, active: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Active</div>
                                                <div className="text-[10px] font-medium text-slate-500">Disable to pause this rule without deleting.</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                            <Button variant="ghost" onClick={() => { setPolicyOpen(false); setEditingPolicy(null) }} className="h-10 px-5 font-semibold text-xs">Close</Button>
                            <Button onClick={handleSavePolicy} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs border-none">
                                {editingPolicy ? "Save rule" : "Add rule"}
                            </Button>
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

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {children}
    </div>
)

const PolicyRow = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={cn("text-xs font-semibold", valueColor ?? "text-slate-800")}>{value}</span>
    </div>
)

export default ReimbursementsPage
