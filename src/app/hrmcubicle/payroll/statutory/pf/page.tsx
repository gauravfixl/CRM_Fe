"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Landmark,
    ChevronLeft,
    Plus,
    FileSpreadsheet,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Users,
    IndianRupee,
    TrendingUp,
    Pencil,
    Trash2,
    Search,
    Filter,
    ArrowLeftRight,
    Wallet,
    PlusCircle,
    Banknote,
    ReceiptText,
    Copy,
    Eye,
    MoreHorizontal,
    FileText,
    Info,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    useStatutoryStore,
    PFRecord,
    PFTransferRequest,
    PFWithdrawalClaim,
    PFAdvance,
} from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const PFManagement = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        pfRecords,
        addPFRecord,
        updatePFRecord,
        deletePFRecord,
        pfTransferRequests,
        pfWithdrawalClaims,
        pfAdvances,
        addPFTransferRequest,
        updatePFTransferRequest,
        deletePFTransferRequest,
        generateForm13,
        addPFWithdrawalClaim,
        updatePFWithdrawalClaim,
        deletePFWithdrawalClaim,
        settleWithdrawalClaim,
        addPFAdvance,
        updatePFAdvance,
        deletePFAdvance,
        approvePFAdvance,
        computeEligibleAdvance,
    } = useStatutoryStore()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editRecord, setEditRecord] = useState<PFRecord | null>(null)
    const [formData, setFormData] = useState({ employeeId: "", employeeName: "", uan: "", month: "Mar 2026", basicPay: "" })

    // ── Round 2 state: transfers / withdrawals / advances ──
    const [activeReqTab, setActiveReqTab] = useState<"transfers" | "withdrawals" | "advances">("transfers")

    // Transfer request dialog state
    const [isTransferOpen, setIsTransferOpen] = useState(false)
    const [editTransfer, setEditTransfer] = useState<PFTransferRequest | null>(null)
    const [transferForm, setTransferForm] = useState({
        employeeId: "",
        previousEmployerName: "",
        previousEmployerPfNumber: "",
        notes: "",
    })

    // Withdrawal claim dialog state
    const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false)
    const [editWithdrawal, setEditWithdrawal] = useState<PFWithdrawalClaim | null>(null)
    const [withdrawalForm, setWithdrawalForm] = useState({
        employeeId: "",
        claimType: "Form 19 (Final Settlement)" as PFWithdrawalClaim["claimType"],
        reason: "",
        claimedAmount: "",
        documentsAttached: "",
    })

    // Advance dialog state
    const [isAdvanceOpen, setIsAdvanceOpen] = useState(false)
    const [editAdvance, setEditAdvance] = useState<PFAdvance | null>(null)
    const [advanceForm, setAdvanceForm] = useState({
        employeeId: "",
        purpose: "Marriage" as PFAdvance["purpose"],
        requestedAmount: "",
    })
    const [advanceEligibility, setAdvanceEligibility] = useState<{ eligibleLimit: number; reason: string } | null>(null)

    // Approve advance dialog
    const [isApproveOpen, setIsApproveOpen] = useState(false)
    const [approveTarget, setApproveTarget] = useState<PFAdvance | null>(null)
    const [approveForm, setApproveForm] = useState({ approvedAmount: "", notes: "" })

    // Settle withdrawal dialog
    const [isSettleOpen, setIsSettleOpen] = useState(false)
    const [settleTarget, setSettleTarget] = useState<PFWithdrawalClaim | null>(null)
    const [settleAmount, setSettleAmount] = useState("")

    // View transfer details
    const [viewTransfer, setViewTransfer] = useState<PFTransferRequest | null>(null)

    const filtered = useMemo(() => {
        return pfRecords.filter((r) => {
            const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase()) || r.uan.includes(search)
            const matchStatus = statusFilter === "all" || r.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [pfRecords, search, statusFilter])

    const stats = useMemo(() => {
        const totalEmployer = pfRecords.reduce((s, r) => s + r.employerContribution, 0)
        const totalEmployee = pfRecords.reduce((s, r) => s + r.employeeContribution, 0)
        const filed = pfRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const compliance = pfRecords.length > 0 ? Math.round((filed / pfRecords.length) * 100) : 0
        return { totalEmployer, totalEmployee, total: totalEmployer + totalEmployee, filed, compliance }
    }, [pfRecords])

    const monthlyTracker = [
        { month: "Jan 2026", ecrStatus: "Filed", paymentStatus: "Paid", dueDate: "15 Feb 2026" },
        { month: "Feb 2026", ecrStatus: "Filed", paymentStatus: "Paid", dueDate: "15 Mar 2026" },
        { month: "Mar 2026", ecrStatus: "Pending", paymentStatus: "Pending", dueDate: "15 Apr 2026" },
    ]

    const statusColor = (s: string) => {
        switch (s) {
            case "Paid": case "Completed": return "bg-emerald-50 text-emerald-600"
            case "Filed": case "In Progress": case "Submitted": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const handleGenerateECR = () => {
        const headers = ["UAN,Member Name,Gross Wages,EPF Wages,EPS Wages,EDLI Wages,EPF Contribution(EE),EPS Contribution(ER),EPF Contribution(ER),EDLI Contribution(ER),NCP Days,Refund of Advances"]
        const rows = pfRecords.map((r) => `${r.uan},${r.employeeName},${r.basicPay},${r.basicPay},${Math.min(r.basicPay, 15000)},${r.basicPay},${r.employeeContribution},${r.epsContribution},${r.employerContribution - r.epsContribution},${r.edliContribution},0,0`)
        const csv = [...headers, ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ECR_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "ECR Generated", description: "Electronic Challan cum Return file downloaded successfully." })
    }

    const handleSave = () => {
        const basic = parseFloat(formData.basicPay) || 0
        const ee = Math.round(basic * 0.12)
        const er = Math.round(basic * 0.12)
        const eps = Math.round(Math.min(basic, 15000) * 0.0833)
        const edli = Math.round(basic * 0.005)

        if (editRecord) {
            updatePFRecord(editRecord.id, {
                employeeName: formData.employeeName,
                uan: formData.uan,
                month: formData.month,
                basicPay: basic,
                employeeContribution: ee,
                employerContribution: er,
                epsContribution: eps,
                edliContribution: edli,
            })
            toast({ title: "Record Updated", description: `PF record for ${formData.employeeName} updated.` })
        } else {
            addPFRecord({
                id: `pf-${Date.now()}`,
                employeeId: formData.employeeId,
                employeeName: formData.employeeName,
                uan: formData.uan,
                month: formData.month,
                basicPay: basic,
                employeeContribution: ee,
                employerContribution: er,
                epsContribution: eps,
                edliContribution: edli,
                status: "Pending",
            })
            toast({ title: "Record Added", description: `PF record for ${formData.employeeName} created.` })
        }
        setIsAddOpen(false)
        setEditRecord(null)
        setFormData({ employeeId: "", employeeName: "", uan: "", month: "Mar 2026", basicPay: "" })
    }

    const openEdit = (r: PFRecord) => {
        setEditRecord(r)
        setFormData({ employeeId: r.employeeId, employeeName: r.employeeName, uan: r.uan, month: r.month, basicPay: r.basicPay.toString() })
        setIsAddOpen(true)
    }

    const handleDelete = (id: string, name: string) => {
        deletePFRecord(id)
        toast({ title: "Record Deleted", description: `PF record for ${name} removed.` })
    }

    // ── Round 2 computed values ──
    const round2Stats = useMemo(() => {
        const transfersInProgress = pfTransferRequests.filter(r => r.status === "Under Review").length
        const pendingWithdrawals = pfWithdrawalClaims.filter(c => ["Submitted", "Verified", "Approved"].includes(c.status)).length
        const pendingAdvances = pfAdvances.filter(a => a.status === "Pending")
        const pendingAdvanceTotal = pendingAdvances.reduce((s, a) => s + a.requestedAmount, 0)

        const settled = pfWithdrawalClaims.filter(c => c.status === "Settled" && c.settledDate)
        let avgSettlementDays: number | null = null
        if (settled.length) {
            const totalDays = settled.reduce((sum, c) => {
                const claim = new Date(c.claimDate).getTime()
                const settle = new Date(c.settledDate!).getTime()
                return sum + Math.max(0, Math.round((settle - claim) / (1000 * 60 * 60 * 24)))
            }, 0)
            avgSettlementDays = Math.round(totalDays / settled.length)
        }

        return {
            transfersInProgress,
            pendingWithdrawals,
            pendingAdvancesCount: pendingAdvances.length,
            pendingAdvanceTotal,
            avgSettlementDays,
        }
    }, [pfTransferRequests, pfWithdrawalClaims, pfAdvances])

    // Badge helpers
    const transferStatusColor = (s: PFTransferRequest["status"]) => {
        switch (s) {
            case "Submitted": return "bg-amber-50 text-amber-600"
            case "Under Review": return "bg-indigo-50 text-indigo-600"
            case "Transferred": return "bg-emerald-50 text-emerald-600"
            case "Rejected": return "bg-rose-50 text-rose-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const withdrawalStatusColor = (s: PFWithdrawalClaim["status"]) => {
        switch (s) {
            case "Submitted": return "bg-amber-50 text-amber-600"
            case "Verified": return "bg-indigo-50 text-indigo-600"
            case "Approved": return "bg-blue-50 text-blue-600"
            case "Settled": return "bg-emerald-50 text-emerald-600"
            case "Rejected": return "bg-rose-50 text-rose-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const advanceStatusColor = (s: PFAdvance["status"]) => {
        switch (s) {
            case "Pending": return "bg-amber-50 text-amber-600"
            case "Approved": return "bg-indigo-50 text-indigo-600"
            case "Disbursed": return "bg-emerald-50 text-emerald-600"
            case "Rejected": return "bg-rose-50 text-rose-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const purposeColor = (p: PFAdvance["purpose"]) => {
        switch (p) {
            case "Marriage": return "bg-pink-50 text-pink-600"
            case "Education": return "bg-blue-50 text-blue-600"
            case "Medical": return "bg-rose-50 text-rose-600"
            case "Housing": return "bg-emerald-50 text-emerald-600"
            case "Covid-19": return "bg-amber-50 text-amber-600"
            case "Natural Calamity": return "bg-orange-50 text-orange-600"
            default: return "bg-slate-50 text-slate-600"
        }
    }

    // ── Transfer handlers ──
    const openNewTransfer = () => {
        setEditTransfer(null)
        setTransferForm({ employeeId: "", previousEmployerName: "", previousEmployerPfNumber: "", notes: "" })
        setIsTransferOpen(true)
    }

    const openEditTransfer = (t: PFTransferRequest) => {
        setEditTransfer(t)
        setTransferForm({
            employeeId: t.employeeId,
            previousEmployerName: t.previousEmployerName,
            previousEmployerPfNumber: t.previousEmployerPfNumber,
            notes: t.notes ?? "",
        })
        setIsTransferOpen(true)
    }

    const handleSaveTransfer = () => {
        const emp = pfRecords.find(r => r.employeeId === transferForm.employeeId)
        if (!emp) {
            toast({ title: "Select an employee", description: "Please choose an employee from the list.", variant: "destructive" })
            return
        }
        if (!transferForm.previousEmployerName.trim() || !transferForm.previousEmployerPfNumber.trim()) {
            toast({ title: "Missing details", description: "Previous employer name and PF number are required.", variant: "destructive" })
            return
        }
        if (editTransfer) {
            updatePFTransferRequest(editTransfer.id, {
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                uan: emp.uan,
                previousEmployerName: transferForm.previousEmployerName,
                previousEmployerPfNumber: transferForm.previousEmployerPfNumber,
                notes: transferForm.notes || undefined,
            })
            toast({ title: "Transfer Updated", description: `Request for ${emp.employeeName} updated.` })
        } else {
            addPFTransferRequest({
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                uan: emp.uan,
                previousEmployerName: transferForm.previousEmployerName,
                previousEmployerPfNumber: transferForm.previousEmployerPfNumber,
                requestDate: new Date().toISOString().split("T")[0],
                form13Generated: false,
                status: "Submitted",
                notes: transferForm.notes || undefined,
            })
            toast({ title: "Transfer Request Created", description: `New transfer request for ${emp.employeeName}.` })
        }
        setIsTransferOpen(false)
        setEditTransfer(null)
    }

    const handleGenerateForm13 = (t: PFTransferRequest) => {
        generateForm13(t.id)
        toast({ title: "Form 13 Generated", description: `Form 13 generated for ${t.employeeName}.` })
    }

    const handleDeleteTransfer = (t: PFTransferRequest) => {
        deletePFTransferRequest(t.id)
        toast({ title: "Transfer Deleted", description: `Request for ${t.employeeName} removed.` })
    }

    // ── Withdrawal handlers ──
    const openNewWithdrawal = () => {
        setEditWithdrawal(null)
        setWithdrawalForm({ employeeId: "", claimType: "Form 19 (Final Settlement)", reason: "", claimedAmount: "", documentsAttached: "" })
        setIsWithdrawalOpen(true)
    }

    const openEditWithdrawal = (c: PFWithdrawalClaim) => {
        setEditWithdrawal(c)
        setWithdrawalForm({
            employeeId: c.employeeId,
            claimType: c.claimType,
            reason: c.reason ?? "",
            claimedAmount: c.claimedAmount.toString(),
            documentsAttached: (c.documentsAttached ?? []).join(", "),
        })
        setIsWithdrawalOpen(true)
    }

    const handleSaveWithdrawal = () => {
        const emp = pfRecords.find(r => r.employeeId === withdrawalForm.employeeId)
        if (!emp) {
            toast({ title: "Select an employee", description: "Please choose an employee.", variant: "destructive" })
            return
        }
        const amount = parseFloat(withdrawalForm.claimedAmount) || 0
        if (amount <= 0) {
            toast({ title: "Invalid amount", description: "Enter a valid claimed amount.", variant: "destructive" })
            return
        }
        const docs = withdrawalForm.documentsAttached.split(",").map(d => d.trim()).filter(Boolean)
        if (editWithdrawal) {
            updatePFWithdrawalClaim(editWithdrawal.id, {
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                uan: emp.uan,
                claimType: withdrawalForm.claimType,
                reason: withdrawalForm.reason || undefined,
                claimedAmount: amount,
                documentsAttached: docs.length ? docs : undefined,
            })
            toast({ title: "Claim Updated", description: `Withdrawal claim for ${emp.employeeName} updated.` })
        } else {
            addPFWithdrawalClaim({
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                uan: emp.uan,
                claimType: withdrawalForm.claimType,
                claimDate: new Date().toISOString().split("T")[0],
                reason: withdrawalForm.reason || undefined,
                claimedAmount: amount,
                status: "Submitted",
                documentsAttached: docs.length ? docs : undefined,
            })
            toast({ title: "Claim Created", description: `Withdrawal claim submitted for ${emp.employeeName}.` })
        }
        setIsWithdrawalOpen(false)
        setEditWithdrawal(null)
    }

    const handleDeleteWithdrawal = (c: PFWithdrawalClaim) => {
        deletePFWithdrawalClaim(c.id)
        toast({ title: "Claim Deleted", description: `Claim for ${c.employeeName} removed.` })
    }

    const openSettle = (c: PFWithdrawalClaim) => {
        setSettleTarget(c)
        setSettleAmount(c.claimedAmount.toString())
        setIsSettleOpen(true)
    }

    const handleSettleClaim = () => {
        if (!settleTarget) return
        const amt = parseFloat(settleAmount) || 0
        if (amt <= 0) {
            toast({ title: "Invalid amount", description: "Enter a valid settled amount.", variant: "destructive" })
            return
        }
        settleWithdrawalClaim(settleTarget.id, amt)
        toast({ title: "Claim Settled", description: `${settleTarget.employeeName}: ₹${amt.toLocaleString("en-IN")} settled.` })
        setIsSettleOpen(false)
        setSettleTarget(null)
        setSettleAmount("")
    }

    // ── Advance handlers ──
    const openNewAdvance = () => {
        setEditAdvance(null)
        setAdvanceForm({ employeeId: "", purpose: "Marriage", requestedAmount: "" })
        setAdvanceEligibility(null)
        setIsAdvanceOpen(true)
    }

    const openEditAdvance = (a: PFAdvance) => {
        setEditAdvance(a)
        setAdvanceForm({
            employeeId: a.employeeId,
            purpose: a.purpose,
            requestedAmount: a.requestedAmount.toString(),
        })
        setAdvanceEligibility({ eligibleLimit: a.eligibleLimit ?? 0, reason: a.eligibilityNotes ?? "" })
        setIsAdvanceOpen(true)
    }

    const refreshAdvanceEligibility = (employeeId: string, purpose: PFAdvance["purpose"]) => {
        if (!employeeId) {
            setAdvanceEligibility(null)
            return
        }
        const res = computeEligibleAdvance(employeeId, purpose)
        setAdvanceEligibility(res)
    }

    const handleSaveAdvance = () => {
        const emp = pfRecords.find(r => r.employeeId === advanceForm.employeeId)
        if (!emp) {
            toast({ title: "Select an employee", description: "Please choose an employee.", variant: "destructive" })
            return
        }
        const amt = parseFloat(advanceForm.requestedAmount) || 0
        if (amt <= 0) {
            toast({ title: "Invalid amount", description: "Enter a valid requested amount.", variant: "destructive" })
            return
        }
        const eligibility = advanceEligibility ?? computeEligibleAdvance(emp.employeeId, advanceForm.purpose)
        if (editAdvance) {
            updatePFAdvance(editAdvance.id, {
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                uan: emp.uan,
                purpose: advanceForm.purpose,
                requestedAmount: amt,
                eligibleLimit: eligibility.eligibleLimit,
                eligibilityNotes: eligibility.reason,
            })
            toast({ title: "Advance Updated", description: `Advance for ${emp.employeeName} updated.` })
        } else {
            addPFAdvance({
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                uan: emp.uan,
                purpose: advanceForm.purpose,
                requestedAmount: amt,
                requestDate: new Date().toISOString().split("T")[0],
                status: "Pending",
                eligibleLimit: eligibility.eligibleLimit,
                eligibilityNotes: eligibility.reason,
            })
            toast({ title: "Advance Requested", description: `${emp.employeeName} requested ₹${amt.toLocaleString("en-IN")}.` })
        }
        setIsAdvanceOpen(false)
        setEditAdvance(null)
    }

    const handleDeleteAdvance = (a: PFAdvance) => {
        deletePFAdvance(a.id)
        toast({ title: "Advance Deleted", description: `Advance for ${a.employeeName} removed.` })
    }

    const openApprove = (a: PFAdvance) => {
        setApproveTarget(a)
        setApproveForm({ approvedAmount: a.requestedAmount.toString(), notes: a.eligibilityNotes ?? "" })
        setIsApproveOpen(true)
    }

    const handleApprove = () => {
        if (!approveTarget) return
        const amt = parseFloat(approveForm.approvedAmount) || 0
        if (amt <= 0) {
            toast({ title: "Invalid amount", description: "Enter a valid approved amount.", variant: "destructive" })
            return
        }
        approvePFAdvance(approveTarget.id, amt, approveForm.notes || undefined)
        toast({ title: "Advance Approved", description: `${approveTarget.employeeName}: ₹${amt.toLocaleString("en-IN")} approved.` })
        setIsApproveOpen(false)
        setApproveTarget(null)
    }

    const advanceOverLimit = advanceEligibility
        && parseFloat(advanceForm.requestedAmount || "0") > advanceEligibility.eligibleLimit
        && advanceEligibility.eligibleLimit > 0

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => router.push("/hrmcubicle/payroll/statutory")}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                        <Landmark size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Provident Fund Management</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">EPF / EPS / EDLI Contributions & ECR Filing</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={handleGenerateECR}>
                        <FileSpreadsheet size={14} /> Generate ECR
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={() => { setEditRecord(null); setFormData({ employeeId: "", employeeName: "", uan: "", month: "Mar 2026", basicPay: "" }); setIsAddOpen(true) }}>
                        <Plus size={14} /> Add Record
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-8 pb-32">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total PF Contribution", val: `₹${(stats.total / 100000).toFixed(2)}L`, icon: IndianRupee, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: `EE: ₹${(stats.totalEmployee / 1000).toFixed(0)}K + ER: ₹${(stats.totalEmployer / 1000).toFixed(0)}K` },
                            { label: "ECR Filed This Month", val: monthlyTracker.find((m) => m.month === "Mar 2026")?.ecrStatus || "Pending", icon: FileSpreadsheet, color: "text-blue-500", bg: "bg-blue-50", trend: "Due: 15 Apr 2026" },
                            { label: "Compliance Rate", val: `${stats.compliance}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50", trend: `${stats.filed}/${pfRecords.length} filed` },
                            { label: "Total Employees", val: pfRecords.length.toString(), icon: Users, color: "text-amber-500", bg: "bg-amber-50", trend: "Under PF coverage" },
                        ].map((stat, i) => (
                            <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-slate-50 max-w-[140px] truncate">{stat.trend}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input placeholder="Search by name, ID, or UAN..." className="pl-9 h-10 rounded-lg border-slate-200 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] h-10 rounded-lg border-slate-200 text-xs font-medium">
                                <Filter size={12} className="mr-1.5" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Filed">Filed</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Employee PF Table */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Employee PF Contributions</h3>
                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{filtered.length} records</Badge>
                            </div>
                            <ScrollArea className="max-h-[420px]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr>
                                            {["Employee", "UAN", "Basic Pay", "EE (12%)", "ER (12%)", "EPS (8.33%)", "EDLI", "Status", "Actions"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r) => (
                                            <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="text-xs font-bold text-slate-700">{r.employeeName}</p>
                                                    <p className="text-[10px] text-slate-400">{r.employeeId}</p>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono text-slate-600">{r.uan}</td>
                                                <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{r.basicPay.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.employeeContribution.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.employerContribution.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.epsContribution.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.edliContribution.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.status))}>{r.status}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => openEdit(r)}>
                                                            <Pencil size={12} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500" onClick={() => handleDelete(r.id, r.employeeName)}>
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Monthly Return Tracker */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Monthly PF Return Tracker</h3>
                            </div>
                            <div className="p-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {["Month", "ECR Status", "Payment", "Due Date"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyTracker.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-none">
                                                <td className="py-3 text-xs font-bold text-slate-700">{row.month}</td>
                                                <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(row.ecrStatus))}>{row.ecrStatus}</Badge></td>
                                                <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(row.paymentStatus))}>{row.paymentStatus}</Badge></td>
                                                <td className="py-3 text-xs text-slate-500">{row.dueDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Round 2: Member Services — Transfers / Withdrawals / Advances ── */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 tracking-tight">PF Member Services</h2>
                                <p className="text-xs text-slate-500 font-medium">Transfers (Form 13), Withdrawal claims, and PF Advances with eligibility</p>
                            </div>
                        </div>

                        {/* Round 2 Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Transfers in Progress", val: round2Stats.transfersInProgress.toString(), icon: ArrowLeftRight, color: "text-indigo-500", bg: "bg-indigo-50", trend: "Under EPFO review" },
                                { label: "Pending Withdrawals", val: round2Stats.pendingWithdrawals.toString(), icon: Wallet, color: "text-amber-500", bg: "bg-amber-50", trend: "Submitted / Verified / Approved" },
                                { label: "Pending Advances", val: round2Stats.pendingAdvancesCount.toString(), icon: Banknote, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: `₹${(round2Stats.pendingAdvanceTotal / 1000).toFixed(0)}K requested` },
                                { label: "Avg. Settlement Time", val: round2Stats.avgSettlementDays !== null ? `${round2Stats.avgSettlementDays}d` : "—", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50", trend: "Claim → Settled" },
                            ].map((stat, i) => (
                                <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                                <stat.icon size={20} />
                                            </div>
                                            <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-slate-50 max-w-[160px] truncate">{stat.trend}</Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* 3-Tab Section */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <Tabs value={activeReqTab} onValueChange={(v) => setActiveReqTab(v as typeof activeReqTab)}>
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                                        <TabsList className="bg-slate-100/60 rounded-lg p-1">
                                            <TabsTrigger value="transfers" className="rounded-md text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-2">
                                                <ArrowLeftRight size={12} /> Transfers
                                                <Badge variant="outline" className="text-[9px] font-bold border-slate-200 bg-white/60">{pfTransferRequests.length}</Badge>
                                            </TabsTrigger>
                                            <TabsTrigger value="withdrawals" className="rounded-md text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-2">
                                                <Wallet size={12} /> Withdrawals
                                                <Badge variant="outline" className="text-[9px] font-bold border-slate-200 bg-white/60">{pfWithdrawalClaims.length}</Badge>
                                            </TabsTrigger>
                                            <TabsTrigger value="advances" className="rounded-md text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-2">
                                                <Banknote size={12} /> Advances
                                                <Badge variant="outline" className="text-[9px] font-bold border-slate-200 bg-white/60">{pfAdvances.length}</Badge>
                                            </TabsTrigger>
                                        </TabsList>
                                        {activeReqTab === "transfers" && (
                                            <Button onClick={openNewTransfer} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-md shadow-[#8B5CF6]/20 gap-2">
                                                <PlusCircle size={14} /> New transfer request
                                            </Button>
                                        )}
                                        {activeReqTab === "withdrawals" && (
                                            <Button onClick={openNewWithdrawal} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-md shadow-[#8B5CF6]/20 gap-2">
                                                <PlusCircle size={14} /> New claim
                                            </Button>
                                        )}
                                        {activeReqTab === "advances" && (
                                            <Button onClick={openNewAdvance} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-md shadow-[#8B5CF6]/20 gap-2">
                                                <PlusCircle size={14} /> New advance request
                                            </Button>
                                        )}
                                    </div>

                                    {/* Transfers tab */}
                                    <TabsContent value="transfers" className="m-0">
                                        <ScrollArea className="max-h-[460px]">
                                            <table className="w-full">
                                                <thead className="sticky top-0 bg-slate-50 z-10">
                                                    <tr>
                                                        {["Employee", "Previous Employer", "Request Date", "Form 13", "EPFO Ack #", "Status", "Amount", "Actions"].map(h => (
                                                            <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pfTransferRequests.length === 0 && (
                                                        <tr><td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400">No transfer requests yet.</td></tr>
                                                    )}
                                                    {pfTransferRequests.map(t => (
                                                        <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3">
                                                                <p className="text-xs font-bold text-slate-700">{t.employeeName}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono">UAN {t.uan}</p>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <p className="text-xs font-medium text-slate-700">{t.previousEmployerName}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono">{t.previousEmployerPfNumber}</p>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-slate-600">{t.requestDate}</td>
                                                            <td className="px-4 py-3">
                                                                {t.form13Generated ? (
                                                                    <Badge className="border-none font-bold text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 gap-1">
                                                                        <CheckCircle2 size={10} /> Generated{t.form13GeneratedDate ? ` · ${t.form13GeneratedDate}` : ""}
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="border-none font-bold text-[9px] px-2 py-0.5 bg-rose-50 text-rose-600">Not generated</Badge>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-slate-600 font-mono">{t.epfoAckNumber ?? "—"}</td>
                                                            <td className="px-4 py-3">
                                                                <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", transferStatusColor(t.status))}>{t.status}</Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs font-bold text-slate-700">{t.transferredAmount ? `₹${t.transferredAmount.toLocaleString("en-IN")}` : "—"}</td>
                                                            <td className="px-4 py-3">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]">
                                                                            <MoreHorizontal size={14} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2" disabled={t.form13Generated} onClick={() => handleGenerateForm13(t)}>
                                                                            <FileText size={12} /> Generate Form 13
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2" onClick={() => setViewTransfer(t)}>
                                                                            <Eye size={12} /> View
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2" onClick={() => openEditTransfer(t)}>
                                                                            <Pencil size={12} /> Edit
                                                                        </DropdownMenuItem>
                                                                        {t.epfoAckNumber && (
                                                                            <DropdownMenuItem className="text-xs font-medium gap-2" onClick={() => { navigator.clipboard.writeText(t.epfoAckNumber!); toast({ title: "Copied", description: "EPFO ACK # copied to clipboard." }) }}>
                                                                                <Copy size={12} /> Copy Ack #
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2 text-rose-600 focus:text-rose-600" onClick={() => handleDeleteTransfer(t)}>
                                                                            <Trash2 size={12} /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Withdrawals tab */}
                                    <TabsContent value="withdrawals" className="m-0">
                                        <ScrollArea className="max-h-[460px]">
                                            <table className="w-full">
                                                <thead className="sticky top-0 bg-slate-50 z-10">
                                                    <tr>
                                                        {["Employee", "Claim Type", "Claim Date", "Reason", "Claimed", "Status", "Settled", "Actions"].map(h => (
                                                            <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pfWithdrawalClaims.length === 0 && (
                                                        <tr><td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400">No withdrawal claims yet.</td></tr>
                                                    )}
                                                    {pfWithdrawalClaims.map(c => (
                                                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3">
                                                                <p className="text-xs font-bold text-slate-700">{c.employeeName}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono">UAN {c.uan}</p>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <Badge variant="outline" className="border-slate-200 text-[9px] font-bold text-slate-600 bg-slate-50 gap-1">
                                                                    <ReceiptText size={10} /> {c.claimType}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-slate-600">{c.claimDate}</td>
                                                            <td className="px-4 py-3 text-xs text-slate-600 max-w-[180px] truncate">{c.reason ?? "—"}</td>
                                                            <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{c.claimedAmount.toLocaleString("en-IN")}</td>
                                                            <td className="px-4 py-3">
                                                                <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", withdrawalStatusColor(c.status))}>{c.status}</Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs">
                                                                {c.settledAmount ? (
                                                                    <div>
                                                                        <p className="font-bold text-emerald-600">₹{c.settledAmount.toLocaleString("en-IN")}</p>
                                                                        <p className="text-[10px] text-slate-400">{c.settledDate}</p>
                                                                    </div>
                                                                ) : <span className="text-slate-400">—</span>}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]">
                                                                            <MoreHorizontal size={14} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2" disabled={c.status === "Settled" || c.status === "Rejected"} onClick={() => openSettle(c)}>
                                                                            <CheckCircle2 size={12} /> Settle
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2" onClick={() => openEditWithdrawal(c)}>
                                                                            <Pencil size={12} /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-xs font-medium gap-2 text-rose-600 focus:text-rose-600" onClick={() => handleDeleteWithdrawal(c)}>
                                                                            <Trash2 size={12} /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Advances tab */}
                                    <TabsContent value="advances" className="m-0">
                                        <ScrollArea className="max-h-[460px]">
                                            <TooltipProvider>
                                                <table className="w-full">
                                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                                        <tr>
                                                            {["Employee", "Purpose", "Requested", "Approved", "Eligible Limit", "Status", "Disbursed", "Actions"].map(h => (
                                                                <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pfAdvances.length === 0 && (
                                                            <tr><td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400">No advance requests yet.</td></tr>
                                                        )}
                                                        {pfAdvances.map(a => (
                                                            <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <p className="text-xs font-bold text-slate-700">{a.employeeName}</p>
                                                                    <p className="text-[10px] text-slate-400 font-mono">UAN {a.uan}</p>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", purposeColor(a.purpose))}>{a.purpose}</Badge>
                                                                </td>
                                                                <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{a.requestedAmount.toLocaleString("en-IN")}</td>
                                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">{a.approvedAmount ? `₹${a.approvedAmount.toLocaleString("en-IN")}` : "—"}</td>
                                                                <td className="px-4 py-3">
                                                                    {a.eligibleLimit ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 cursor-help">
                                                                                    ₹{a.eligibleLimit.toLocaleString("en-IN")}
                                                                                    <Info size={11} className="text-slate-400" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="max-w-[260px] text-xs">
                                                                                {a.eligibilityNotes ?? "Eligibility computed from basic pay and purpose."}
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ) : <span className="text-slate-400 text-xs">—</span>}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", advanceStatusColor(a.status))}>{a.status}</Badge>
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-slate-600">{a.disbursedDate ?? "—"}</td>
                                                                <td className="px-4 py-3">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]">
                                                                                <MoreHorizontal size={14} />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</DropdownMenuLabel>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className="text-xs font-medium gap-2" disabled={a.status !== "Pending"} onClick={() => openApprove(a)}>
                                                                                <CheckCircle2 size={12} /> Approve with amount
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="text-xs font-medium gap-2" onClick={() => openEditAdvance(a)}>
                                                                                <Pencil size={12} /> Edit
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className="text-xs font-medium gap-2 text-rose-600 focus:text-rose-600" onClick={() => handleDeleteAdvance(a)}>
                                                                                <Trash2 size={12} /> Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </TooltipProvider>
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add/Edit PF Sheet */}
            <SideFormSheet
                open={isAddOpen}
                onOpenChange={(o) => { setIsAddOpen(o); if (!o) setEditRecord(null) }}
                title={editRecord ? "Edit PF Record" : "Add PF Record"}
                description={editRecord ? "Update the PF contribution details." : "Enter employee details. Contributions will be auto-calculated at 12%."}
                icon={<Landmark size={20} />}
                accentColor={editRecord ? "#7c3aed" : "#4f46e5"}
                width="md"
                submitLabel={editRecord ? "Update" : "Add Record"}
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee ID">
                            <Input value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} disabled={!!editRecord} />
                        </Field>
                        <Field label="Employee Name">
                            <Input value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="UAN">
                            <Input value={formData.uan} onChange={(e) => setFormData({ ...formData, uan: e.target.value })} />
                        </Field>
                        <Field label="Month">
                            <Input value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Basic Pay (₹)">
                        <Input type="number" value={formData.basicPay} onChange={(e) => setFormData({ ...formData, basicPay: e.target.value })} />
                    </Field>
                    {formData.basicPay && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto-Calculated Contributions</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-slate-500">Employee (12%):</span> <span className="font-bold text-slate-700">₹{Math.round(parseFloat(formData.basicPay) * 0.12).toLocaleString("en-IN")}</span></div>
                                <div><span className="text-slate-500">Employer (12%):</span> <span className="font-bold text-slate-700">₹{Math.round(parseFloat(formData.basicPay) * 0.12).toLocaleString("en-IN")}</span></div>
                                <div><span className="text-slate-500">EPS (8.33%):</span> <span className="font-bold text-slate-700">₹{Math.round(Math.min(parseFloat(formData.basicPay), 15000) * 0.0833).toLocaleString("en-IN")}</span></div>
                                <div><span className="text-slate-500">EDLI (0.5%):</span> <span className="font-bold text-slate-700">₹{Math.round(parseFloat(formData.basicPay) * 0.005).toLocaleString("en-IN")}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </SideFormSheet>

            {/* Transfer Request Sheet */}
            <SideFormSheet
                open={isTransferOpen}
                onOpenChange={(o) => { setIsTransferOpen(o); if (!o) setEditTransfer(null) }}
                title={editTransfer ? "Edit Transfer Request" : "New Transfer Request"}
                description="Submit a PF transfer from the employee's previous employer. Form 13 can be generated after submission."
                icon={<ArrowLeftRight size={20} />}
                accentColor={editTransfer ? "#7c3aed" : "#4f46e5"}
                width="lg"
                submitLabel={editTransfer ? "Update Request" : "Submit Request"}
                onSubmit={(e) => { e.preventDefault(); handleSaveTransfer(); }}
            >
                <div className="space-y-4">
                    <Field label="Employee">
                        <Select value={transferForm.employeeId} onValueChange={(v) => setTransferForm({ ...transferForm, employeeId: v })}>
                            <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                            <SelectContent>
                                {pfRecords.map(r => (
                                    <SelectItem key={r.id} value={r.employeeId} className="text-xs">
                                        {r.employeeName} — UAN {r.uan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Previous Employer">
                            <Input value={transferForm.previousEmployerName} onChange={(e) => setTransferForm({ ...transferForm, previousEmployerName: e.target.value })} placeholder="Acme Technologies Ltd" />
                        </Field>
                        <Field label="Previous PF Number">
                            <Input className="font-mono" value={transferForm.previousEmployerPfNumber} onChange={(e) => setTransferForm({ ...transferForm, previousEmployerPfNumber: e.target.value })} placeholder="MH/BAN/12345/001234" />
                        </Field>
                    </div>
                    <Field label="Notes">
                        <Textarea value={transferForm.notes} onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })} placeholder="Any context or special handling notes..." />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Withdrawal Claim Sheet */}
            <SideFormSheet
                open={isWithdrawalOpen}
                onOpenChange={(o) => { setIsWithdrawalOpen(o); if (!o) setEditWithdrawal(null) }}
                title={editWithdrawal ? "Edit Withdrawal Claim" : "New Withdrawal Claim"}
                description="Submit a PF withdrawal claim (Form 19 / 10C / 31 / 10D) for settlement."
                icon={<Wallet size={20} />}
                accentColor={editWithdrawal ? "#7c3aed" : "#4f46e5"}
                width="lg"
                submitLabel={editWithdrawal ? "Update Claim" : "Submit Claim"}
                onSubmit={(e) => { e.preventDefault(); handleSaveWithdrawal(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee">
                            <Select value={withdrawalForm.employeeId} onValueChange={(v) => setWithdrawalForm({ ...withdrawalForm, employeeId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    {pfRecords.map(r => (
                                        <SelectItem key={r.id} value={r.employeeId} className="text-xs">
                                            {r.employeeName} — UAN {r.uan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Claim Type">
                            <Select value={withdrawalForm.claimType} onValueChange={(v) => setWithdrawalForm({ ...withdrawalForm, claimType: v as PFWithdrawalClaim["claimType"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Form 19 (Final Settlement)" className="text-xs">Form 19 (Final Settlement)</SelectItem>
                                    <SelectItem value="Form 10C (Pension)" className="text-xs">Form 10C (Pension)</SelectItem>
                                    <SelectItem value="Form 31 (Advance)" className="text-xs">Form 31 (Advance)</SelectItem>
                                    <SelectItem value="Form 10D (Pension Benefit)" className="text-xs">Form 10D (Pension Benefit)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <Field label="Reason">
                        <Input value={withdrawalForm.reason} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, reason: e.target.value })} placeholder="Resignation / Medical / Superannuation..." />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Claimed Amount (₹)">
                            <Input type="number" value={withdrawalForm.claimedAmount} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, claimedAmount: e.target.value })} />
                        </Field>
                        <Field label="Documents (comma separated)">
                            <Input value={withdrawalForm.documentsAttached} onChange={(e) => setWithdrawalForm({ ...withdrawalForm, documentsAttached: e.target.value })} placeholder="pan.pdf, aadhaar.pdf" />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>

            {/* Advance Request Sheet */}
            <SideFormSheet
                open={isAdvanceOpen}
                onOpenChange={(o) => { setIsAdvanceOpen(o); if (!o) { setEditAdvance(null); setAdvanceEligibility(null) } }}
                title={editAdvance ? "Edit Advance Request" : "New Advance Request"}
                description="Request a PF advance under Scheme 68. Eligible limit is auto-computed from basic pay and purpose."
                icon={<Banknote size={20} />}
                accentColor={editAdvance ? "#7c3aed" : "#4f46e5"}
                width="lg"
                submitLabel={editAdvance ? "Update Advance" : "Submit Advance"}
                onSubmit={(e) => { e.preventDefault(); handleSaveAdvance(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee">
                            <Select value={advanceForm.employeeId} onValueChange={(v) => { setAdvanceForm({ ...advanceForm, employeeId: v }); refreshAdvanceEligibility(v, advanceForm.purpose) }}>
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    {pfRecords.map(r => (
                                        <SelectItem key={r.id} value={r.employeeId} className="text-xs">
                                            {r.employeeName} — UAN {r.uan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Purpose">
                            <Select value={advanceForm.purpose} onValueChange={(v) => { const p = v as PFAdvance["purpose"]; setAdvanceForm({ ...advanceForm, purpose: p }); refreshAdvanceEligibility(advanceForm.employeeId, p) }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {(["Marriage", "Education", "Medical", "Housing", "Covid-19", "Natural Calamity", "Other"] as PFAdvance["purpose"][]).map(p => (
                                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <Field label="Requested Amount (₹)">
                        <Input type="number" value={advanceForm.requestedAmount} onChange={(e) => setAdvanceForm({ ...advanceForm, requestedAmount: e.target.value })} />
                    </Field>
                    {advanceEligibility && (
                        <div className={cn("p-3 rounded-xl border space-y-1.5", advanceOverLimit ? "bg-amber-50 border-amber-200" : "bg-emerald-50/60 border-emerald-200")}>
                            <div className="flex items-center gap-2">
                                {advanceOverLimit ? <AlertTriangle size={14} className="text-amber-600" /> : <CheckCircle2 size={14} className="text-emerald-600" />}
                                <p className={cn("text-[10px] font-bold uppercase tracking-wider", advanceOverLimit ? "text-amber-700" : "text-emerald-700")}>
                                    {advanceOverLimit ? "Exceeds eligible limit" : "Within eligible limit"}
                                </p>
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                                Eligible Limit: ₹{advanceEligibility.eligibleLimit.toLocaleString("en-IN")}
                            </p>
                            <p className="text-[11px] text-slate-600">{advanceEligibility.reason}</p>
                        </div>
                    )}
                </div>
            </SideFormSheet>

            {/* Approve Advance Sheet */}
            <SideFormSheet
                open={isApproveOpen}
                onOpenChange={(o) => { setIsApproveOpen(o); if (!o) setApproveTarget(null) }}
                title="Approve PF Advance"
                description={approveTarget ? `Approve advance for ${approveTarget.employeeName} (${approveTarget.purpose}).` : undefined}
                icon={<CheckCircle2 size={20} />}
                accentColor="#059669"
                width="md"
                submitLabel="Approve"
                onSubmit={(e) => { e.preventDefault(); handleApprove(); }}
            >
                <div className="space-y-4">
                    {approveTarget && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs grid grid-cols-2 gap-2">
                            <div><span className="text-slate-500">Requested:</span> <span className="font-bold text-slate-800">₹{approveTarget.requestedAmount.toLocaleString("en-IN")}</span></div>
                            <div><span className="text-slate-500">Eligible:</span> <span className="font-bold text-slate-800">{approveTarget.eligibleLimit ? `₹${approveTarget.eligibleLimit.toLocaleString("en-IN")}` : "—"}</span></div>
                        </div>
                    )}
                    <Field label="Approved Amount (₹)">
                        <Input type="number" value={approveForm.approvedAmount} onChange={(e) => setApproveForm({ ...approveForm, approvedAmount: e.target.value })} />
                    </Field>
                    <Field label="Approval Notes">
                        <Textarea value={approveForm.notes} onChange={(e) => setApproveForm({ ...approveForm, notes: e.target.value })} placeholder="Eligibility basis, conditions, committee remarks..." />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Settle Withdrawal Sheet */}
            <SideFormSheet
                open={isSettleOpen}
                onOpenChange={(o) => { setIsSettleOpen(o); if (!o) setSettleTarget(null) }}
                title="Settle Withdrawal Claim"
                description={settleTarget ? `Settle claim for ${settleTarget.employeeName} (${settleTarget.claimType}).` : undefined}
                icon={<CheckCircle2 size={20} />}
                accentColor="#059669"
                width="md"
                submitLabel="Confirm Settlement"
                onSubmit={(e) => { e.preventDefault(); handleSettleClaim(); }}
            >
                <div className="space-y-4">
                    {settleTarget && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                            <p><span className="text-slate-500">Claimed:</span> <span className="font-bold text-slate-800">₹{settleTarget.claimedAmount.toLocaleString("en-IN")}</span></p>
                            <p className="mt-1"><span className="text-slate-500">Claim Date:</span> <span className="font-medium text-slate-700">{settleTarget.claimDate}</span></p>
                        </div>
                    )}
                    <Field label="Settled Amount (₹)">
                        <Input type="number" value={settleAmount} onChange={(e) => setSettleAmount(e.target.value)} />
                    </Field>
                </div>
            </SideFormSheet>

            {/* ── View Transfer Details Dialog ── */}
            <Dialog open={!!viewTransfer} onOpenChange={(o) => { if (!o) setViewTransfer(null) }}>
                <DialogContent className="sm:max-w-[520px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ArrowLeftRight size={18} className="text-[#8B5CF6]" />
                            Transfer Request Details
                        </DialogTitle>
                    </DialogHeader>
                    {viewTransfer && (
                        <div className="space-y-3 py-2 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee</p><p className="font-bold text-slate-800">{viewTransfer.employeeName}</p><p className="text-[10px] text-slate-500 font-mono">UAN {viewTransfer.uan}</p></div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Request Date</p><p className="font-medium text-slate-700">{viewTransfer.requestDate}</p></div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous Employer</p><p className="font-medium text-slate-700">{viewTransfer.previousEmployerName}</p></div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous PF #</p><p className="font-mono text-slate-700">{viewTransfer.previousEmployerPfNumber}</p></div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Form 13</p>{viewTransfer.form13Generated ? <Badge className="border-none font-bold text-[9px] bg-emerald-50 text-emerald-600">Generated {viewTransfer.form13GeneratedDate}</Badge> : <Badge className="border-none font-bold text-[9px] bg-rose-50 text-rose-600">Not generated</Badge>}</div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p><Badge className={cn("border-none font-bold text-[9px]", transferStatusColor(viewTransfer.status))}>{viewTransfer.status}</Badge></div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EPFO Ack #</p><p className="font-mono text-slate-700">{viewTransfer.epfoAckNumber ?? "—"}</p></div>
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transferred</p><p className="font-bold text-slate-700">{viewTransfer.transferredAmount ? `₹${viewTransfer.transferredAmount.toLocaleString("en-IN")} · ${viewTransfer.transferredDate}` : "—"}</p></div>
                            </div>
                            {viewTransfer.notes && (
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Notes</p>
                                    <p className="text-slate-700">{viewTransfer.notes}</p>
                                </div>
                            )}
                            {viewTransfer.rejectionReason && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">Rejection Reason</p>
                                    <p className="text-rose-700">{viewTransfer.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => setViewTransfer(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PFManagement
