"use client"

import React, { useState, useRef, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
    FileSearch,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Upload,
    Scale,
    ShieldCheck,
    Download,
    X,
    Paperclip,
    AlertCircle,
    MessageSquare,
    Plus,
    Edit,
    Trash2,
    RotateCcw,
    Link2,
    Send,
    ChevronDown,
    ScanLine,
    Wand2,
    Zap,
    Bell,
    Check,
    Target,
    ShieldAlert,
    Sparkles,
    FileWarning,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Textarea } from "@/shared/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { usePayrollStore, type InvestmentProof, type ProofPolicyRule } from "@/shared/data/payroll-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const FISCAL_YEARS = ["2025-26", "2024-25", "2023-24"]

const PROOF_TYPES = [
    { code: "80C", label: "80C — Investments", max: 150000, subTypes: ["LIC Premium", "PPF", "ELSS Mutual Fund", "EPF", "NSC", "Tax Saver FD", "Tuition Fees", "Principal (Home Loan)"] },
    { code: "80CCD(1B)", label: "80CCD(1B) — NPS", max: 50000, subTypes: ["NPS Contribution"] },
    { code: "80D", label: "80D — Health Insurance", max: 100000, subTypes: ["Health Insurance (Self+Family)", "Parents Health Insurance", "Preventive Check-up"] },
    { code: "80E", label: "80E — Education Loan", max: -1, subTypes: ["Education Loan Interest"] },
    { code: "80G", label: "80G — Donations", max: -1, subTypes: ["Donations"] },
    { code: "HRA", label: "HRA — House Rent", max: -1, subTypes: ["Rent Receipt", "Rent Agreement"] },
    { code: "Sec 24", label: "Sec 24 — Home Loan Interest", max: 200000, subTypes: ["Home Loan Interest Certificate"] },
    { code: "LIC", label: "LIC — Life Insurance", max: 150000, subTypes: ["Life Insurance Premium"] },
    { code: "PPF", label: "PPF — Provident Fund", max: 150000, subTypes: ["Public Provident Fund"] },
    { code: "Others", label: "Others", max: -1, subTypes: ["Miscellaneous"] },
]

const REJECTION_TAGS = [
    "Missing PAN",
    "Illegible Document",
    "Amount Mismatch",
    "Outside FY",
    "Duplicate Submission",
    "Invalid Document Type",
    "Policy Gap",
]

const emptyProofForm: Omit<InvestmentProof, "id"> = {
    empCode: "",
    employeeId: "",
    employeeName: "",
    dept: "",
    fiscalYear: "2025-26",
    type: "80C",
    subCategory: "",
    amount: 0,
    documentUrl: "",
    documentName: "",
    documentSize: 0,
    documentType: "",
    status: "Pending",
    submittedDate: new Date().toISOString().split("T")[0],
    comments: [],
}

const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ProofSubmissionPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const employeeIdParam = searchParams?.get("employeeId") ?? ""

    const {
        proofs,
        declarations,
        addProof,
        updateProof,
        deleteProof,
        approveProof,
        rejectProof,
        bulkUpdateProofStatus,
        bulkDeleteProofs,
        addProofComment,
        // Round 2
        runOcrOnProof,
        bulkRunOcr,
        matchProofWithDeclaration,
        bulkMatchProofs,
        autoValidateProof,
        bulkAutoValidate,
        sendProofReminder,
        bulkSendProofReminders,
        proofPolicyRules,
        addProofPolicyRule,
        updateProofPolicyRule,
        deleteProofPolicyRule,
    } = usePayrollStore()
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const batchInputRef = useRef<HTMLInputElement>(null)

    // ── Filters ─────────────────────────────────────────
    const [fyFilter, setFyFilter] = useState<string>("2025-26")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [deptFilter, setDeptFilter] = useState<string>("all")
    const [dateFrom, setDateFrom] = useState<string>("")
    const [dateTo, setDateTo] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState(employeeIdParam)

    useEffect(() => {
        if (employeeIdParam) setSearchQuery(employeeIdParam)
    }, [employeeIdParam])

    // ── Selection ───────────────────────────────────────
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // ── Dialogs ─────────────────────────────────────────
    const [formOpen, setFormOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [approvalOpen, setApprovalOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

    const [selectedProof, setSelectedProof] = useState<InvestmentProof | null>(null)
    const [editingProof, setEditingProof] = useState<InvestmentProof | null>(null)
    const [formData, setFormData] = useState<Omit<InvestmentProof, "id">>(emptyProofForm)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    // ─ Round 2 state ─
    const [ocrResultOpen, setOcrResultOpen] = useState(false)
    const [ocrTarget, setOcrTarget] = useState<InvestmentProof | null>(null)
    const [bulkOcrResult, setBulkOcrResult] = useState<{ processed: number } | null>(null)
    const [bulkMatchResult, setBulkMatchResult] = useState<{ matched: number; mismatched: number; unmatched: number } | null>(null)
    const [bulkValidateResult, setBulkValidateResult] = useState<{ validated: number; flagged: number } | null>(null)
    const [policyOpen, setPolicyOpen] = useState(false)
    const [editingPolicy, setEditingPolicy] = useState<ProofPolicyRule | null>(null)
    const [policyForm, setPolicyForm] = useState<Omit<ProofPolicyRule, "id">>({
        category: "", maxAmount: 0, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true,
    })
    const [reminderResultOpen, setReminderResultOpen] = useState(false)
    const [reminderCount, setReminderCount] = useState(0)

    const [approvalComment, setApprovalComment] = useState("")
    const [approvalTargetId, setApprovalTargetId] = useState<string | null>(null)

    const [rejectReason, setRejectReason] = useState("")
    const [rejectTags, setRejectTags] = useState<string[]>([])
    const [rejectTargetIds, setRejectTargetIds] = useState<string[]>([])

    const [commentText, setCommentText] = useState("")

    // ── Derived data ────────────────────────────────────
    const fyProofs = useMemo(
        () => proofs.filter((p) => (p.fiscalYear ?? "2025-26") === fyFilter),
        [proofs, fyFilter]
    )

    const filteredProofs = useMemo(() => {
        return fyProofs.filter((p) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                if (
                    !p.employeeName.toLowerCase().includes(q) &&
                    !p.employeeId.toLowerCase().includes(q) &&
                    !(p.empCode ?? "").toLowerCase().includes(q) &&
                    !(p.dept ?? "").toLowerCase().includes(q) &&
                    !p.type.toLowerCase().includes(q) &&
                    !(p.documentName ?? "").toLowerCase().includes(q)
                ) return false
            }
            if (statusFilter !== "all" && p.status !== statusFilter) return false
            if (typeFilter !== "all" && p.type !== typeFilter) return false
            if (deptFilter !== "all" && p.dept !== deptFilter) return false
            if (dateFrom && p.submittedDate < dateFrom) return false
            if (dateTo && p.submittedDate > dateTo) return false
            return true
        })
    }, [fyProofs, searchQuery, statusFilter, typeFilter, deptFilter, dateFrom, dateTo])

    const stats = useMemo(() => {
        return {
            total: fyProofs.length,
            pending: fyProofs.filter((p) => p.status === "Pending").length,
            approved: fyProofs.filter((p) => p.status === "Approved").length,
            rejected: fyProofs.filter((p) => p.status === "Rejected").length,
            pendingAmount: fyProofs.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0),
            approvedAmount: fyProofs.filter((p) => p.status === "Approved").reduce((s, p) => s + p.amount, 0),
            totalAmount: fyProofs.reduce((s, p) => s + p.amount, 0),
        }
    }, [fyProofs])

    const categoryStats = useMemo(() => {
        return PROOF_TYPES.map((cat) => {
            const catProofs = fyProofs.filter((p) => p.type === cat.code)
            const approved = catProofs.filter((p) => p.status === "Approved").reduce((s, p) => s + p.amount, 0)
            const pending = catProofs.filter((p) => p.status === "Pending").length
            return { ...cat, count: catProofs.length, approved, pending }
        }).filter((c) => c.count > 0)
    }, [fyProofs])

    const availableDepts = useMemo(
        () => Array.from(new Set(fyProofs.map((p) => p.dept).filter(Boolean) as string[])),
        [fyProofs]
    )

    const hasActiveFilters =
        statusFilter !== "all" || typeFilter !== "all" || deptFilter !== "all" || dateFrom || dateTo

    const clearFilters = () => {
        setStatusFilter("all")
        setTypeFilter("all")
        setDeptFilter("all")
        setDateFrom("")
        setDateTo("")
        setSearchQuery("")
    }

    // ── Selection ───────────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visible = filteredProofs.map((p) => p.id)
        const allSel = visible.every((id) => selectedIds.includes(id))
        if (allSel) setSelectedIds((prev) => prev.filter((id) => !visible.includes(id)))
        else setSelectedIds((prev) => Array.from(new Set([...prev, ...visible])))
    }

    // ── Form handlers ───────────────────────────────────
    const openAddForm = () => {
        setEditingProof(null)
        setFormData({ ...emptyProofForm, fiscalYear: fyFilter })
        setUploadedFile(null)
        setFormOpen(true)
    }

    const openEditForm = (proof: InvestmentProof) => {
        setEditingProof(proof)
        setFormData({
            empCode: proof.empCode,
            employeeId: proof.employeeId,
            employeeName: proof.employeeName,
            dept: proof.dept,
            fiscalYear: proof.fiscalYear ?? fyFilter,
            type: proof.type,
            subCategory: proof.subCategory,
            amount: proof.amount,
            documentUrl: proof.documentUrl,
            documentName: proof.documentName,
            documentSize: proof.documentSize,
            documentType: proof.documentType,
            status: proof.status,
            submittedDate: proof.submittedDate,
            comments: proof.comments ?? [],
            linkedDeclarationId: proof.linkedDeclarationId,
            approvedBy: proof.approvedBy,
            approvedDate: proof.approvedDate,
            approvalComment: proof.approvalComment,
            rejectedBy: proof.rejectedBy,
            rejectedDate: proof.rejectedDate,
            rejectionReason: proof.rejectionReason,
            rejectionTags: proof.rejectionTags,
        })
        setUploadedFile(null)
        setFormOpen(true)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max 5MB allowed.", variant: "destructive" })
            return
        }
        const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
        if (!allowed.includes(file.type)) {
            toast({ title: "Invalid file type", description: "Only PDF and images (JPG/PNG) allowed.", variant: "destructive" })
            return
        }
        setUploadedFile(file)
        const url = URL.createObjectURL(file)
        setFormData((prev) => ({
            ...prev,
            documentUrl: url,
            documentName: file.name,
            documentSize: file.size,
            documentType: file.type,
        }))
    }

    const handleSubmit = () => {
        if (!formData.employeeName.trim() || !formData.employeeId.trim() || formData.amount <= 0) {
            toast({ title: "Missing fields", description: "Employee name, ID and a positive amount are required.", variant: "destructive" })
            return
        }

        // Cap check
        const cat = PROOF_TYPES.find((c) => c.code === formData.type)
        if (cat && cat.max > 0 && formData.amount > cat.max) {
            const ok = window.confirm(
                `Amount ${formatINR(formData.amount)} exceeds ${cat.label} cap of ${formatINR(cat.max)}. Submit anyway?`
            )
            if (!ok) return
        }

        // Duplicate check for new submissions
        if (!editingProof) {
            const duplicate = proofs.find(
                (p) => p.employeeId === formData.employeeId && p.type === formData.type && p.fiscalYear === formData.fiscalYear
            )
            if (duplicate) {
                const ok = window.confirm(
                    `A ${formData.type} proof already exists for ${formData.employeeName} in FY ${formData.fiscalYear}. Add another?`
                )
                if (!ok) return
            }
        }

        // New submissions require a document (edits can keep existing)
        if (!editingProof && !uploadedFile && !formData.documentUrl) {
            toast({ title: "Document required", description: "Upload a supporting document.", variant: "destructive" })
            return
        }

        if (editingProof) {
            updateProof(editingProof.id, formData)
            toast({ title: "Proof updated", description: `${formData.employeeName} — ${formData.type}.` })
        } else {
            addProof(formData)
            toast({ title: "Proof submitted", description: `${formData.employeeName} — ${formData.type} logged for audit.` })
        }
        setFormOpen(false)
        setEditingProof(null)
        setUploadedFile(null)
    }

    const handleDelete = (id: string) => {
        const p = proofs.find((x) => x.id === id)
        deleteProof(id)
        toast({ title: "Proof removed", description: `${p?.employeeName ?? "Record"} deleted.`, variant: "destructive" })
        setSelectedIds((prev) => prev.filter((i) => i !== id))
    }

    const handleBulkApprove = () => {
        if (!selectedIds.length) return
        const eligible = selectedIds.filter((id) => proofs.find((p) => p.id === id)?.status === "Pending")
        if (!eligible.length) {
            toast({ title: "Nothing to approve", description: "Only pending proofs can be bulk-approved.", variant: "destructive" })
            return
        }
        eligible.forEach((id) => approveProof(id, "HR Manager"))
        toast({ title: `Approved ${eligible.length}`, description: "Bulk approval complete." })
        setSelectedIds([])
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        bulkDeleteProofs(selectedIds)
        toast({ title: `Deleted ${selectedIds.length}`, variant: "destructive" })
        setSelectedIds([])
        setDeleteConfirmOpen(false)
    }

    // ─── Round 2 handlers ────────────────────────────────
    const handleRunOcr = (proof: InvestmentProof) => {
        runOcrOnProof(proof.id)
        const updated = usePayrollStore.getState().proofs.find(p => p.id === proof.id)
        if (updated) {
            setOcrTarget(updated)
            setOcrResultOpen(true)
        }
    }

    const handleBulkOcr = () => {
        if (!selectedIds.length) return
        const result = bulkRunOcr(selectedIds)
        setBulkOcrResult(result)
        toast({
            title: `OCR complete on ${result.processed}`,
            description: "Extracted amounts + dates populated.",
        })
    }

    const handleMatch = (proof: InvestmentProof) => {
        const result = matchProofWithDeclaration(proof.id)
        toast({
            title: result.matched ? "Match" : "Mismatch",
            description: result.notes,
            variant: result.matched ? "default" : "destructive",
        })
    }

    const handleBulkMatch = () => {
        if (!selectedIds.length) return
        const result = bulkMatchProofs(selectedIds)
        setBulkMatchResult(result)
    }

    const handleAutoValidate = (proof: InvestmentProof) => {
        const result = autoValidateProof(proof.id)
        toast({
            title: result.issues.length === 0 ? "All checks passed" : `${result.issues.length} issue${result.issues.length > 1 ? "s" : ""} flagged`,
            description: result.issues.slice(0, 2).join(" · ") || "Proof is policy-compliant.",
            variant: result.issues.length > 0 ? "destructive" : "default",
        })
    }

    const handleBulkValidate = () => {
        if (!selectedIds.length) return
        const result = bulkAutoValidate(selectedIds)
        setBulkValidateResult(result)
    }

    const handleSendReminder = (proof: InvestmentProof) => {
        sendProofReminder(proof.id)
        toast({ title: "Reminder sent", description: `${proof.employeeName} notified via email.` })
    }

    const handleBulkReminders = () => {
        if (!selectedIds.length) return
        const count = bulkSendProofReminders(selectedIds)
        setReminderCount(count)
        setReminderResultOpen(true)
        setSelectedIds([])
    }

    // Policy rule handlers
    const openPolicyEditor = (rule?: ProofPolicyRule) => {
        if (rule) {
            setEditingPolicy(rule)
            setPolicyForm({
                category: rule.category,
                maxAmount: rule.maxAmount,
                documentRequired: rule.documentRequired,
                autoApproveIfWithinCap: rule.autoApproveIfWithinCap,
                autoRejectIfNoDoc: rule.autoRejectIfNoDoc,
                active: rule.active,
            })
        } else {
            setEditingPolicy(null)
            setPolicyForm({ category: "", maxAmount: 0, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true })
        }
        setPolicyOpen(true)
    }

    const handleSavePolicy = () => {
        if (!policyForm.category.trim()) {
            toast({ title: "Category required", variant: "destructive" })
            return
        }
        if (editingPolicy) {
            updateProofPolicyRule(editingPolicy.id, policyForm)
            toast({ title: "Policy updated" })
        } else {
            addProofPolicyRule(policyForm)
            toast({ title: "Policy rule added" })
        }
        setPolicyOpen(false)
        setEditingPolicy(null)
    }

    const handleDeletePolicy = (id: string) => {
        deleteProofPolicyRule(id)
        toast({ title: "Policy deleted", variant: "destructive" })
    }

    // Approval with comment
    const openApprovalDialog = (id: string) => {
        setApprovalTargetId(id)
        setApprovalComment("")
        setApprovalOpen(true)
    }

    const handleConfirmApproval = () => {
        if (!approvalTargetId) return
        approveProof(approvalTargetId, "HR Manager", approvalComment || undefined)
        const p = proofs.find((x) => x.id === approvalTargetId)
        toast({ title: "Proof approved", description: `${p?.employeeName ?? ""} verified${approvalComment ? " with note" : ""}.` })
        setApprovalOpen(false)
        setApprovalComment("")
        setApprovalTargetId(null)
    }

    // Reject
    const openRejectDialog = (ids: string[]) => {
        setRejectTargetIds(ids)
        setRejectReason("")
        setRejectTags([])
        setRejectOpen(true)
    }

    const handleConfirmReject = () => {
        if (!rejectReason.trim() && rejectTags.length === 0) {
            toast({ title: "Reason required", description: "Enter a reason or pick a tag.", variant: "destructive" })
            return
        }
        rejectTargetIds.forEach((id) => rejectProof(id, rejectReason || rejectTags.join(", "), rejectTags))
        toast({
            title: `Rejected ${rejectTargetIds.length}`,
            description: "Employees will see the reason in their portal.",
            variant: "destructive",
        })
        setRejectOpen(false)
        setRejectReason("")
        setRejectTags([])
        setRejectTargetIds([])
        setSelectedIds((prev) => prev.filter((id) => !rejectTargetIds.includes(id)))
    }

    const handleAddComment = () => {
        if (!selectedProof || !commentText.trim()) return
        addProofComment(selectedProof.id, "HR Manager", commentText.trim())
        toast({ title: "Comment added" })
        const updated = {
            ...selectedProof,
            comments: [
                ...(selectedProof.comments ?? []),
                { id: `cm-${Date.now()}`, author: "HR Manager", text: commentText.trim(), timestamp: new Date().toISOString() },
            ],
        }
        setSelectedProof(updated)
        setCommentText("")
    }

    // ── CSV export ──────────────────────────────────────
    const handleExport = () => {
        if (!fyProofs.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const source = filteredProofs.length ? filteredProofs : fyProofs
        const headers = [
            "Emp Code", "Name", "Department", "FY", "Type", "Sub-category", "Amount",
            "Document", "File Size", "Status", "Submitted", "Approved By", "Approved Date",
            "Rejection Reason", "Linked Declaration",
        ]
        const rows = source.map((p) => [
            p.empCode ?? p.employeeId,
            `"${p.employeeName}"`,
            p.dept ?? "",
            p.fiscalYear ?? "",
            p.type,
            `"${p.subCategory ?? ""}"`,
            p.amount,
            `"${p.documentName ?? ""}"`,
            formatFileSize(p.documentSize),
            p.status,
            p.submittedDate,
            p.approvedBy ?? "",
            p.approvedDate ?? "",
            `"${(p.rejectionReason ?? "").replace(/"/g, "'")}"`,
            p.linkedDeclarationId ?? "",
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `proof_submissions_${fyFilter}_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${source.length} rows downloaded.` })
    }

    // Batch import
    const handleBatchImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const text = String(ev.target?.result ?? "")
            const lines = text.split(/\r?\n/).filter((l) => l.trim())
            if (lines.length < 2) {
                toast({ title: "Empty file", description: "Need header + data rows.", variant: "destructive" })
                return
            }
            const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
            const required = ["empcode", "name", "type", "amount"]
            const missing = required.filter((r) => !headers.includes(r))
            if (missing.length) {
                toast({ title: "Missing columns", description: `Required: ${missing.join(", ")}.`, variant: "destructive" })
                return
            }
            let added = 0
            let skipped = 0
            lines.slice(1).forEach((line) => {
                const cells = line.split(",").map((c) => c.trim())
                const row: Record<string, string> = {}
                headers.forEach((h, i) => (row[h] = cells[i] ?? ""))
                if (!row.empcode || !row.name || !row.amount) {
                    skipped++
                    return
                }
                addProof({
                    ...emptyProofForm,
                    empCode: row.empcode,
                    employeeId: row.empcode,
                    employeeName: row.name,
                    dept: row.dept || "",
                    fiscalYear: row.fy || fyFilter,
                    type: row.type || "80C",
                    subCategory: row.subcategory || "",
                    amount: parseFloat(row.amount) || 0,
                    documentName: row.documentname || "imported.pdf",
                    submittedDate: row.date || new Date().toISOString().split("T")[0],
                })
                added++
            })
            toast({
                title: added ? `Imported ${added}` : "Nothing imported",
                description: `${skipped} rows skipped.`,
                variant: added ? "default" : "destructive",
            })
        }
        reader.readAsText(file)
        if (batchInputRef.current) batchInputRef.current.value = ""
    }

    // Cap for currently-selected type in form
    const currentTypeCap = useMemo(() => PROOF_TYPES.find((c) => c.code === formData.type)?.max ?? -1, [formData.type])

    // Find declaration match for current employee + FY
    const possibleDeclarations = useMemo(() => {
        return declarations.filter(
            (d) => d.employeeId === formData.employeeId && d.fiscalYear === formData.fiscalYear
        )
    }, [declarations, formData.employeeId, formData.fiscalYear])

    // ── Render ──────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Hidden inputs */}
                <input ref={batchInputRef} type="file" accept=".csv" onChange={handleBatchImport} className="hidden" />

                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <FileSearch size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Proof Submission</h1>
                            <p className="text-xs font-medium text-slate-500">Investment proofs, audit & verification</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={fyFilter} onValueChange={setFyFilter}>
                            <SelectTrigger className="h-9 w-32 rounded-lg border-slate-200 bg-white font-semibold text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FISCAL_YEARS.map((fy) => (<SelectItem key={fy} value={fy}>FY {fy}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => batchInputRef.current?.click()}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Upload size={14} /> <span className="hidden md:inline">Batch import</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openPolicyEditor()}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <ShieldAlert size={14} /> <span className="hidden md:inline">Policy rules ({proofPolicyRules.length})</span>
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
                            <Plus size={14} /> <span className="hidden md:inline">New proof</span>
                        </Button>
                    </div>
                </div>

                {employeeIdParam && (
                    <div className="px-6 lg:px-8 pt-4">
                        <div className="p-3 bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs">
                                <Link2 size={14} className="text-[#8B5CF6]" />
                                <span className="font-semibold text-slate-700">Filtered for employee:</span>
                                <Badge className="bg-[#8B5CF6] text-white border-none text-[10px] font-bold">{employeeIdParam}</Badge>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { router.replace("/hrmcubicle/payroll/proof-submission"); setSearchQuery("") }}
                                className="h-7 text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                            >
                                <X size={12} className="mr-1" /> Clear
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Pending audit" value={String(stats.pending)} caption={formatINR(stats.pendingAmount)} icon={Clock} color="#F59E0B" />
                            <StatCard label="Approved" value={String(stats.approved)} caption={formatINR(stats.approvedAmount)} icon={ShieldCheck} color="#10B981" />
                            <StatCard label="Rejected" value={String(stats.rejected)} caption={`${stats.total} total`} icon={XCircle} color="#F43F5E" />
                            <StatCard label="Total quantum" value={formatINR(stats.totalAmount)} caption={`FY ${fyFilter}`} icon={Scale} color="#8B5CF6" />
                        </div>

                        {/* Category stats */}
                        {categoryStats.length > 0 && (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 space-y-0">
                                    <CardTitle className="text-base font-bold text-slate-900">Category utilisation</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        Approved amount vs cap per section (FY {fyFilter}).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {categoryStats.map((cat) => {
                                            const pct = cat.max > 0 ? Math.min(100, (cat.approved / cat.max) * 100) : 0
                                            return (
                                                <div key={cat.code} className="p-3 rounded-xl border border-slate-200 bg-white">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-bold px-2">
                                                            {cat.code}
                                                        </Badge>
                                                        {cat.pending > 0 && (
                                                            <span className="text-[10px] font-semibold text-amber-600">{cat.pending} pending</span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-sm font-bold text-slate-900 tabular-nums">{formatINR(cat.approved)}</span>
                                                            {cat.max > 0 && <span className="text-[10px] font-medium text-slate-400">/ {formatINR(cat.max)}</span>}
                                                        </div>
                                                        {cat.max > 0 ? (
                                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-[#8B5CF6] rounded-full"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-[10px] font-medium text-slate-400">No cap</div>
                                                        )}
                                                        <div className="text-[10px] font-medium text-slate-500">{cat.count} proof{cat.count > 1 ? "s" : ""}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Audit pipeline table */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">Audit pipeline</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        {filteredProofs.length} of {fyProofs.length} proofs
                                    </CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative flex-1 min-w-[200px] lg:w-60 lg:flex-none">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Search name, type, doc..."
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
                                                        {[statusFilter !== "all", typeFilter !== "all", deptFilter !== "all", !!dateFrom, !!dateTo].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-72 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-900">Filter proofs</h4>
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
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Type</Label>
                                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All types</SelectItem>
                                                        {PROOF_TYPES.map((t) => (<SelectItem key={t.code} value={t.code}>{t.code}</SelectItem>))}
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
                                                <Button size="sm" onClick={handleBulkOcr} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/5">
                                                    <ScanLine size={12} className="mr-1" /> Run OCR
                                                </Button>
                                                <Button size="sm" onClick={handleBulkMatch} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-blue-200 text-blue-600 hover:bg-blue-50">
                                                    <Target size={12} className="mr-1" /> Match decl
                                                </Button>
                                                <Button size="sm" onClick={handleBulkValidate} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                                    <Wand2 size={12} className="mr-1" /> Auto-validate
                                                </Button>
                                                <Button size="sm" onClick={handleBulkReminders} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-amber-200 text-amber-600 hover:bg-amber-50">
                                                    <Bell size={12} className="mr-1" /> Remind
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
                                                        checked={filteredProofs.length > 0 && filteredProofs.every((p) => selectedIds.includes(p.id))}
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={filteredProofs.length === 0}
                                                        className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                    />
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Amount</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Document</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Submitted</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProofs.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                        {fyProofs.length === 0 ? `No proofs for FY ${fyFilter}.` : "No proofs match the current filters."}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredProofs.map((proof) => {
                                                    const cat = PROOF_TYPES.find((c) => c.code === proof.type)
                                                    return (
                                                        <TableRow key={proof.id} className={cn("group border-slate-50", selectedIds.includes(proof.id) ? "bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10" : "hover:bg-slate-50/70")}>
                                                            <TableCell className="pl-6 py-3">
                                                                <Checkbox
                                                                    checked={selectedIds.includes(proof.id)}
                                                                    onCheckedChange={() => toggleSelect(proof.id)}
                                                                    className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                        {proof.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-sm font-semibold text-slate-900 truncate">{proof.employeeName}</div>
                                                                        <div className="text-[11px] font-medium text-slate-500 truncate">
                                                                            {proof.empCode ?? proof.employeeId}{proof.dept ? ` • ${proof.dept}` : ""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <div>
                                                                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-semibold">{proof.type}</Badge>
                                                                    {proof.subCategory && <div className="text-[10px] font-medium text-slate-500 mt-0.5 truncate max-w-[150px]">{proof.subCategory}</div>}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-3 text-sm font-bold text-slate-900 tabular-nums">
                                                                {formatINR(proof.amount)}
                                                                {cat && cat.max > 0 && proof.amount > cat.max && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <AlertCircle size={12} className="inline-block ml-1 text-amber-500" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Exceeds {proof.type} cap of {formatINR(cat.max)}</TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                {proof.documentName ? (
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <FileText size={14} className="text-[#8B5CF6] shrink-0" />
                                                                        <div className="min-w-0">
                                                                            <div className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">{proof.documentName}</div>
                                                                            <div className="text-[10px] font-medium text-slate-500">{formatFileSize(proof.documentSize)}</div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[11px] font-medium text-slate-400 italic">No document</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3 text-[11px] font-medium text-slate-500">{proof.submittedDate}</TableCell>
                                                            <TableCell className="py-3">
                                                                <div className="flex flex-col gap-1">
                                                                    <Badge className={cn("w-fit border-none text-[10px] font-semibold px-2 py-0.5",
                                                                        proof.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                                            proof.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                                                "bg-amber-50 text-amber-600")}>
                                                                        {proof.status}
                                                                    </Badge>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {proof.ocrExtraction && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <ScanLine size={9} /> OCR {Math.round(proof.ocrExtraction.confidence * 100)}%
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    Detected {formatINR(proof.ocrExtraction.detectedAmount ?? 0)}
                                                                                    {proof.ocrExtraction.detectedVendor ? ` · ${proof.ocrExtraction.detectedVendor}` : ""}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {proof.matchStatus && proof.matchStatus !== "NotChecked" && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className={cn("border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5",
                                                                                        proof.matchStatus === "Match" ? "bg-emerald-50 text-emerald-600" :
                                                                                            proof.matchStatus === "Mismatch" ? "bg-rose-50 text-rose-600" :
                                                                                                "bg-slate-50 text-slate-500")}>
                                                                                        <Target size={9} /> {proof.matchStatus}
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>{proof.matchNotes ?? proof.matchStatus}</TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {proof.validationIssues && proof.validationIssues.length > 0 && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <FileWarning size={9} /> {proof.validationIssues.length}
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>{proof.validationIssues.join(" · ")}</TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {proof.autoValidated && (!proof.validationIssues || proof.validationIssues.length === 0) && (
                                                                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                <Check size={9} /> Clean
                                                                            </Badge>
                                                                        )}
                                                                        {proof.reminderSent && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 gap-0.5">
                                                                                        <Bell size={9} /> {proof.reminderCount ?? 1}
                                                                                    </Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Last reminder {proof.reminderDate ?? ""}</TooltipContent>
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
                                                                                onClick={() => { setSelectedProof(proof); setDetailOpen(true) }}
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
                                                                            {proof.status === "Pending" && (
                                                                                <>
                                                                                    <DropdownMenuItem onClick={() => openApprovalDialog(proof.id)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                        <CheckCircle2 size={13} className="mr-2" /> Approve with note
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => openRejectDialog([proof.id])} className="cursor-pointer text-xs font-medium text-rose-600">
                                                                                        <XCircle size={13} className="mr-2" /> Reject
                                                                                    </DropdownMenuItem>
                                                                                </>
                                                                            )}
                                                                            <DropdownMenuItem onClick={() => openEditForm(proof)} className="cursor-pointer text-xs font-medium">
                                                                                <Edit size={13} className="mr-2" /> Edit
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => { setSelectedProof(proof); setDetailOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                                <MessageSquare size={13} className="mr-2" /> Comments
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI & audit</DropdownMenuLabel>
                                                                            <DropdownMenuItem onClick={() => handleRunOcr(proof)} className="cursor-pointer text-xs font-medium text-indigo-600">
                                                                                <ScanLine size={13} className="mr-2" /> Run OCR
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleMatch(proof)} className="cursor-pointer text-xs font-medium text-blue-600">
                                                                                <Target size={13} className="mr-2" /> Match with declaration
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleAutoValidate(proof)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                <Wand2 size={13} className="mr-2" /> Auto-validate
                                                                            </DropdownMenuItem>
                                                                            {proof.status === "Pending" && (
                                                                                <DropdownMenuItem onClick={() => handleSendReminder(proof)} className="cursor-pointer text-xs font-medium text-amber-600">
                                                                                    <Bell size={13} className="mr-2" /> Send reminder
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {proof.linkedDeclarationId && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => router.push(`/hrmcubicle/payroll/tax-declarations`)}
                                                                                    className="cursor-pointer text-xs font-medium"
                                                                                >
                                                                                    <Link2 size={13} className="mr-2" /> View declaration
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem onClick={() => handleDelete(proof.id)} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
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

                {/* Add / Edit Investment Proof Sheet */}
                <SideFormSheet
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    title={editingProof ? "Edit proof" : "New investment proof"}
                    description="Attach supporting documents for tax declarations. Caps are per-section per FY."
                    icon={editingProof ? <Edit size={20} /> : <FileSearch size={20} />}
                    accentColor={editingProof ? "#7c3aed" : "#4f46e5"}
                    width="xl"
                    submitLabel={editingProof ? "Save changes" : "Submit proof"}
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
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
                                        <FormField label="Department">
                                            <Input value={formData.dept ?? ""} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proof</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Fiscal year" required>
                                            <Select value={formData.fiscalYear ?? "2025-26"} onValueChange={(v) => setFormData({ ...formData, fiscalYear: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FISCAL_YEARS.map((fy) => (<SelectItem key={fy} value={fy}>FY {fy}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Type" required>
                                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {PROOF_TYPES.map((t) => (<SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Sub-category">
                                            <Select value={formData.subCategory ?? ""} onValueChange={(v) => setFormData({ ...formData, subCategory: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Pick sub-type" /></SelectTrigger>
                                                <SelectContent>
                                                    {(PROOF_TYPES.find((t) => t.code === formData.type)?.subTypes ?? []).map((st) => (
                                                        <SelectItem key={st} value={st}>{st}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Amount (₹)" required>
                                            <Input
                                                type="number"
                                                value={formData.amount || ""}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                                placeholder="0"
                                                className="h-10 text-sm font-semibold tabular-nums"
                                            />
                                            {currentTypeCap > 0 && (
                                                <p className={cn("text-[11px] font-medium mt-1",
                                                    formData.amount > currentTypeCap ? "text-rose-600 font-semibold" : "text-slate-500")}>
                                                    Cap: {formatINR(currentTypeCap)} {formData.amount > currentTypeCap && " — exceeded!"}
                                                </p>
                                            )}
                                        </FormField>
                                        <FormField label="Submitted date">
                                            <Input type="date" value={formData.submittedDate} onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Linked declaration">
                                            <Select value={formData.linkedDeclarationId ?? "none"} onValueChange={(v) => setFormData({ ...formData, linkedDeclarationId: v === "none" ? undefined : v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Not linked</SelectItem>
                                                    {possibleDeclarations.map((d) => (
                                                        <SelectItem key={d.id} value={d.id}>
                                                            {d.employeeName} • {d.regime} • FY {d.fiscalYear}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document</h4>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    {formData.documentName ? (
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                                            <FileText size={24} className="text-emerald-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-800 truncate">{formData.documentName}</div>
                                                <div className="text-[11px] font-medium text-slate-500">
                                                    {formatFileSize(formData.documentSize)} {formData.documentType ? ` • ${formData.documentType}` : ""}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => { setUploadedFile(null); setFormData({ ...formData, documentName: "", documentSize: 0, documentType: "", documentUrl: "" }) }}
                                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500"
                                            >
                                                <X size={14} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-9 px-3 font-semibold text-xs border-slate-200"
                                            >
                                                Replace
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-[#8B5CF6] transition-all"
                                        >
                                            <Upload size={24} className="text-slate-400 mb-2" />
                                            <span className="text-xs font-semibold text-slate-600">Click to upload PDF or image</span>
                                            <span className="text-[10px] font-medium text-slate-400 mt-1">Max 5MB • PDF / JPG / PNG</span>
                                        </div>
                                    )}
                                </section>
                    </div>
                </SideFormSheet>

                {/* ── Detail Sheet ─────────────────── */}
                <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                    <SheetContent className="sm:max-w-xl p-0 font-sans">
                        {selectedProof && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-50 p-6 border-b border-slate-100 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-semibold px-2 py-0.5 mb-2 w-fit">
                                                {selectedProof.type} • FY {selectedProof.fiscalYear ?? "2025-26"}
                                            </Badge>
                                            <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">{selectedProof.employeeName}</SheetTitle>
                                            <SheetDescription className="text-[11px] font-medium text-slate-500 truncate">
                                                {selectedProof.empCode ?? selectedProof.employeeId}{selectedProof.dept ? ` • ${selectedProof.dept}` : ""} • Trace {selectedProof.id.slice(-8)}
                                            </SheetDescription>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Amount</div>
                                            <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(selectedProof.amount)}</div>
                                            <Badge className={cn("mt-1 border-none text-[10px] font-semibold px-2",
                                                selectedProof.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                    selectedProof.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                        "bg-amber-50 text-amber-600")}>
                                                {selectedProof.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-5">
                                        {selectedProof.subCategory && (
                                            <section>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sub-category</div>
                                                <p className="text-sm font-semibold text-slate-800">{selectedProof.subCategory}</p>
                                            </section>
                                        )}

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Document</div>
                                            {selectedProof.documentName ? (
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                                                    <FileText size={28} className="text-[#8B5CF6] shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-slate-800 truncate">{selectedProof.documentName}</div>
                                                        <div className="text-[11px] font-medium text-slate-500">
                                                            {formatFileSize(selectedProof.documentSize)}
                                                            {selectedProof.documentType ? ` • ${selectedProof.documentType}` : ""}
                                                        </div>
                                                    </div>
                                                    {selectedProof.documentUrl && selectedProof.documentUrl !== "#" ? (
                                                        <a
                                                            href={selectedProof.documentUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="h-8 px-3 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg flex items-center gap-1.5 text-slate-700 hover:bg-slate-50"
                                                        >
                                                            <Eye size={12} /> Open
                                                        </a>
                                                    ) : (
                                                        <Badge className="bg-amber-50 text-amber-600 border-none text-[10px] font-semibold">No preview</Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                                                    <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-semibold text-amber-800">No document attached. Consider rejecting.</p>
                                                </div>
                                            )}
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Validation</div>
                                            <div className="space-y-2">
                                                <PolicyRow label="Policy cap" value={(() => {
                                                    const cat = PROOF_TYPES.find((c) => c.code === selectedProof.type)
                                                    if (!cat || cat.max < 0) return "No cap"
                                                    return selectedProof.amount <= cat.max
                                                        ? `Within cap ${formatINR(cat.max)}`
                                                        : `Exceeds cap ${formatINR(cat.max)}`
                                                })()} valueColor={(() => {
                                                    const cat = PROOF_TYPES.find((c) => c.code === selectedProof.type)
                                                    if (!cat || cat.max < 0) return "text-slate-800"
                                                    return selectedProof.amount <= cat.max ? "text-emerald-600" : "text-rose-600"
                                                })()} />
                                                <PolicyRow label="Document" value={selectedProof.documentName ? "Attached" : "Missing"} valueColor={selectedProof.documentName ? "text-emerald-600" : "text-rose-600"} />
                                                <PolicyRow label="Linked declaration" value={selectedProof.linkedDeclarationId ? "Linked" : "Standalone"} valueColor={selectedProof.linkedDeclarationId ? "text-emerald-600" : "text-slate-500"} />
                                            </div>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timeline</div>
                                            <div className="space-y-1.5">
                                                <PolicyRow label="Submitted" value={selectedProof.submittedDate} />
                                                {selectedProof.approvedDate && (
                                                    <PolicyRow label="Approved" value={`${selectedProof.approvedDate}${selectedProof.approvedBy ? ` by ${selectedProof.approvedBy}` : ""}`} valueColor="text-emerald-600" />
                                                )}
                                                {selectedProof.rejectedDate && (
                                                    <PolicyRow label="Rejected" value={selectedProof.rejectedDate} valueColor="text-rose-600" />
                                                )}
                                            </div>
                                        </section>

                                        {selectedProof.approvalComment && (
                                            <section>
                                                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Approval note</div>
                                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                    <p className="text-xs font-semibold text-emerald-800">{selectedProof.approvalComment}</p>
                                                </div>
                                            </section>
                                        )}

                                        {selectedProof.rejectionReason && (
                                            <section>
                                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Rejection</div>
                                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 space-y-2">
                                                    <p className="text-xs font-semibold text-rose-800 leading-relaxed">{selectedProof.rejectionReason}</p>
                                                    {selectedProof.rejectionTags && selectedProof.rejectionTags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {selectedProof.rejectionTags.map((t) => (
                                                                <Badge key={t} className="bg-white text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5">{t}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                        )}

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Comments ({selectedProof.comments?.length ?? 0})
                                            </div>
                                            <div className="space-y-2 mb-3">
                                                {(selectedProof.comments ?? []).length === 0 && (
                                                    <p className="text-xs text-slate-400 italic">No comments yet.</p>
                                                )}
                                                {(selectedProof.comments ?? []).map((cm) => (
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
                                    {selectedProof.status === "Pending" && (
                                        <>
                                            <Button
                                                onClick={() => { openApprovalDialog(selectedProof.id); setDetailOpen(false) }}
                                                className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none"
                                            >
                                                <CheckCircle2 size={13} className="mr-1.5" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => { openRejectDialog([selectedProof.id]); setDetailOpen(false) }}
                                                variant="outline"
                                                className="flex-1 h-10 text-rose-500 border-rose-200 font-bold text-xs hover:bg-rose-50"
                                            >
                                                <XCircle size={13} className="mr-1.5" /> Reject
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        onClick={() => { openEditForm(selectedProof); setDetailOpen(false) }}
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

                {/* Approval with note Sheet */}
                <SideFormSheet
                    open={approvalOpen}
                    onOpenChange={setApprovalOpen}
                    title="Approve proof"
                    description="Optionally add an approval note. Persisted to the audit trail."
                    icon={<CheckCircle2 size={20} />}
                    accentColor="#059669"
                    width="md"
                    submitLabel="Confirm approve"
                    onSubmit={(e) => { e.preventDefault(); handleConfirmApproval(); }}
                >
                    <Field label="Approval note (optional)">
                        <Textarea
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                            placeholder="e.g., Valid policy, amount matches declaration..."
                        />
                    </Field>
                </SideFormSheet>

                {/* Reject Sheet */}
                <SideFormSheet
                    open={rejectOpen}
                    onOpenChange={setRejectOpen}
                    title={`Reject ${rejectTargetIds.length > 1 ? `${rejectTargetIds.length} proofs` : "proof"}`}
                    description="Reason will be visible to the employee in their portal."
                    icon={<XCircle size={20} />}
                    accentColor="#e11d48"
                    width="md"
                    submitLabel="Confirm reject"
                    onSubmit={(e) => { e.preventDefault(); handleConfirmReject(); }}
                >
                    <div className="space-y-4">
                        <Field label="Reason">
                            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g., Landlord PAN missing, receipt illegible..." />
                        </Field>
                        <Field label="Tags (optional)">
                            <div className="flex flex-wrap gap-1.5">
                                {REJECTION_TAGS.map((tag) => {
                                    const active = rejectTags.includes(tag)
                                    return (
                                        <Badge
                                            key={tag}
                                            onClick={() => setRejectTags((prev) => active ? prev.filter((t) => t !== tag) : [...prev, tag])}
                                            className={cn("cursor-pointer text-[10px] font-semibold px-2 py-1 border",
                                                active ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100")}
                                        >
                                            {tag}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </Field>
                    </div>
                </SideFormSheet>

                {/* ── Bulk delete confirm ─────────── */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete {selectedIds.length} proof{selectedIds.length > 1 ? "s" : ""}?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleBulkDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── OCR Result Dialog ─────────── */}
                <Dialog open={ocrResultOpen} onOpenChange={setOcrResultOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2">
                                <ScanLine size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">OCR Extraction</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Extracted fields from {ocrTarget?.documentName ?? "document"}.
                            </DialogDescription>
                        </DialogHeader>
                        {ocrTarget?.ocrExtraction && (
                            <div className="mt-4 space-y-3">
                                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Confidence</div>
                                        <div className="text-2xl font-bold text-indigo-700 tabular-nums">
                                            {Math.round(ocrTarget.ocrExtraction.confidence * 100)}%
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
                                        <div className="text-sm font-bold text-indigo-700 tabular-nums">{formatINR(ocrTarget.ocrExtraction.detectedAmount ?? 0)}</div>
                                    </div>
                                </div>
                                {ocrTarget.ocrExtraction.detectedVendor && (
                                    <PolicyRow label="Vendor" value={ocrTarget.ocrExtraction.detectedVendor} />
                                )}
                                {ocrTarget.ocrExtraction.detectedDate && (
                                    <PolicyRow label="Date" value={ocrTarget.ocrExtraction.detectedDate} />
                                )}
                                {ocrTarget.ocrExtraction.detectedType && (
                                    <PolicyRow label="Type hint" value={ocrTarget.ocrExtraction.detectedType} />
                                )}
                                {ocrTarget.ocrExtraction.rawText && (
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Raw extract</div>
                                        <div className="p-2 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono leading-relaxed max-h-28 overflow-y-auto">
                                            {ocrTarget.ocrExtraction.rawText}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setOcrResultOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            {ocrTarget && (
                                <Button onClick={() => { handleMatch(ocrTarget); setOcrResultOpen(false) }} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                    <Target size={13} /> Match now
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
                            <DialogTitle className="text-lg font-bold text-slate-900">OCR Batch complete</DialogTitle>
                        </DialogHeader>
                        {bulkOcrResult && (
                            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                                <div className="text-4xl font-bold text-indigo-700 tabular-nums">{bulkOcrResult.processed}</div>
                                <div className="text-xs font-semibold text-indigo-600 mt-1">documents scanned</div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkOcrResult(null)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk Match Result ─────────── */}
                <Dialog open={!!bulkMatchResult} onOpenChange={(o) => !o && setBulkMatchResult(null)}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <Target size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Declaration match</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Proofs compared against linked declarations.
                            </DialogDescription>
                        </DialogHeader>
                        {bulkMatchResult && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-emerald-600 tabular-nums">{bulkMatchResult.matched}</div>
                                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-1">Match</div>
                                </div>
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-rose-600 tabular-nums">{bulkMatchResult.mismatched}</div>
                                    <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mt-1">Mismatch</div>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-slate-500 tabular-nums">{bulkMatchResult.unmatched}</div>
                                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1">Unlinked</div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkMatchResult(null)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 font-bold text-xs border-none">Done</Button>
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
                                Proofs run through policy engine.
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

                {/* ── Reminder Result ─────────── */}
                <Dialog open={reminderResultOpen} onOpenChange={setReminderResultOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                                <Bell size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Reminders sent</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                            <div className="text-4xl font-bold text-amber-600 tabular-nums">{reminderCount}</div>
                            <div className="text-xs font-semibold text-amber-700 mt-1">employees notified via email</div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setReminderResultOpen(false)} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg h-10 font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Policy Editor ─────────── */}
                <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[88vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <ShieldAlert size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Proof policy rules</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Auto-validation runs these rules on every proof. Add caps, document requirements, and auto-actions per category.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {/* Existing rules list */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Existing rules ({proofPolicyRules.length})</h4>
                                    {proofPolicyRules.length === 0 ? (
                                        <p className="text-xs font-medium text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center">No policy rules yet.</p>
                                    ) : (
                                        proofPolicyRules.map((rule) => (
                                            <div key={rule.id} className={cn("p-3 rounded-xl border flex items-center justify-between gap-3",
                                                rule.active ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60")}>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-bold">{rule.category}</Badge>
                                                        {rule.documentRequired && <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-semibold">Doc required</Badge>}
                                                        {rule.autoApproveIfWithinCap && <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-semibold">Auto-approve</Badge>}
                                                        {rule.autoRejectIfNoDoc && <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-semibold">Auto-reject</Badge>}
                                                    </div>
                                                    <div className="text-[11px] font-medium text-slate-600 mt-1">
                                                        Cap: <span className="font-bold tabular-nums">{rule.maxAmount < 0 ? "No cap" : formatINR(rule.maxAmount)}</span>
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
                                                    {PROOF_TYPES.map((t) => (<SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Max amount (₹, -1 for no cap)">
                                            <Input
                                                type="number"
                                                value={policyForm.maxAmount}
                                                onChange={(e) => setPolicyForm({ ...policyForm, maxAmount: parseFloat(e.target.value) || 0 })}
                                                className="h-10 text-sm font-semibold tabular-nums"
                                            />
                                        </FormField>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.documentRequired}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, documentRequired: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Document required</div>
                                                <div className="text-[10px] font-medium text-slate-500">Proof must have an attached file.</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.autoApproveIfWithinCap}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, autoApproveIfWithinCap: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Auto-approve within cap</div>
                                                <div className="text-[10px] font-medium text-slate-500">Auto-validate passes proofs with document and amount within cap.</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <Checkbox
                                                checked={policyForm.autoRejectIfNoDoc}
                                                onCheckedChange={(c) => setPolicyForm({ ...policyForm, autoRejectIfNoDoc: Boolean(c) })}
                                                className="mt-0.5 border-slate-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">Flag when no document</div>
                                                <div className="text-[10px] font-medium text-slate-500">Add validation issue when proof lacks a file.</div>
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

export default ProofSubmissionPage
