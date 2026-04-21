"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Building2,
    ChevronLeft,
    Plus,
    Download,
    Users,
    IndianRupee,
    MapPin,
    TrendingUp,
    Pencil,
    Trash2,
    Search,
    Filter,
    CheckCircle2,
    Info,
    FileText,
    UserCheck,
    Accessibility,
    ShieldCheck,
    CalendarDays,
    Bell,
    FileCheck,
    Upload,
    Ban,
    MoreHorizontal,
    Edit,
    Eye,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import { useStatutoryStore, PTRecord, PTExemption } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const formatINR = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN')
const TODAY = new Date('2026-04-18')

const exemptionTypeMeta: Record<PTExemption['exemptionType'], { icon: any; color: string; bg: string }> = {
    'Senior Citizen': { icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
    'Disability': { icon: Accessibility, color: 'text-blue-600', bg: 'bg-blue-50' },
    'Parents of Disabled Child': { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    'Ex-Servicemen': { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    'Other': { icon: Info, color: 'text-slate-600', bg: 'bg-slate-100' },
}

const computeNextDueDate = (frequency: string, today: Date): { date: Date; label: string } => {
    const y = today.getFullYear()
    const m = today.getMonth()
    const d = today.getDate()
    if (frequency === 'Monthly') {
        const dt = d <= 10 ? new Date(y, m, 10) : new Date(y, m + 1, 10)
        return { date: dt, label: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
    }
    if (frequency === 'Quarterly') {
        const candidates = [new Date(y, 3, 15), new Date(y, 6, 15), new Date(y, 9, 15), new Date(y + 1, 0, 15)]
        const next = candidates.find(c => c.getTime() >= today.getTime()) || candidates[0]
        return { date: next, label: next.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
    }
    // Half-Yearly
    const candidates = [new Date(y, 2, 15), new Date(y, 8, 15), new Date(y + 1, 2, 15)]
    const next = candidates.find(c => c.getTime() >= today.getTime()) || candidates[0]
    return { date: next, label: next.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
}

const daysBetween = (a: Date, b: Date) => Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))

const PTManagement = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        ptRecords,
        ptSlabs,
        ptExemptions,
        addPTRecord,
        updatePTRecord,
        deletePTRecord,
        addPTExemption,
        updatePTExemption,
        deletePTExemption,
        bulkUpdatePTExemptionStatus,
    } = useStatutoryStore()
    const [search, setSearch] = useState("")
    const [stateFilter, setStateFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editRecord, setEditRecord] = useState<PTRecord | null>(null)
    const [slabDialogState, setSlabDialogState] = useState<string | null>(null)
    const [formData, setFormData] = useState({ employeeId: "", employeeName: "", state: "Maharashtra", month: "Mar 2026", grossSalary: "" })

    // Round 2 state
    const [selectedExemptions, setSelectedExemptions] = useState<string[]>([])
    const [isExemptionOpen, setIsExemptionOpen] = useState(false)
    const [editExemption, setEditExemption] = useState<PTExemption | null>(null)
    const [revokeTarget, setRevokeTarget] = useState<PTExemption | null>(null)
    const [revokeReason, setRevokeReason] = useState("")
    const [drillState, setDrillState] = useState<string | null>(null)
    const [exemptionForm, setExemptionForm] = useState<{
        employeeId: string; employeeName: string; state: string;
        exemptionType: PTExemption['exemptionType']; certificateNumber: string;
        validFrom: string; validTo: string; documentName: string; notes: string;
    }>({ employeeId: "", employeeName: "", state: "Maharashtra", exemptionType: "Senior Citizen", certificateNumber: "", validFrom: "", validTo: "", documentName: "", notes: "" })

    const states = useMemo(() => [...new Set(ptRecords.map((r) => r.state))], [ptRecords])

    const filtered = useMemo(() => {
        return ptRecords.filter((r) => {
            const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase())
            const matchState = stateFilter === "all" || r.state === stateFilter
            const matchStatus = statusFilter === "all" || r.status === statusFilter
            return matchSearch && matchState && matchStatus
        })
    }, [ptRecords, search, stateFilter, statusFilter])

    const stats = useMemo(() => {
        const totalPT = ptRecords.reduce((s, r) => s + r.ptDeduction, 0)
        const filed = ptRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const stateCount = new Set(ptRecords.map((r) => r.state)).size
        return { totalPT, filed, total: ptRecords.length, stateCount }
    }, [ptRecords])

    const filingTracker = [
        { state: "Maharashtra", period: "Mar 2026", frequency: "Monthly", dueDate: "30 Apr 2026", status: "Pending" },
        { state: "Karnataka", period: "Q4 FY2025-26", frequency: "Monthly", dueDate: "20 Apr 2026", status: "Pending" },
        { state: "Tamil Nadu", period: "H2 FY2025-26", frequency: "Half-Yearly", dueDate: "30 Apr 2026", status: "Pending" },
        { state: "Maharashtra", period: "Feb 2026", frequency: "Monthly", dueDate: "31 Mar 2026", status: "Paid" },
        { state: "Karnataka", period: "Q3 FY2025-26", frequency: "Monthly", dueDate: "20 Jan 2026", status: "Paid" },
    ]

    const statusColor = (s: string) => {
        switch (s) {
            case "Paid": case "Completed": return "bg-emerald-50 text-emerald-600"
            case "Filed": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const calculatePT = (state: string, salary: number): number => {
        const slab = ptSlabs.find((s) => s.state === state)
        if (!slab) return 200 // default
        const applicable = slab.slabs.filter((sl) => salary >= sl.from).sort((a, b) => b.from - a.from)
        return applicable.length > 0 ? applicable[0].tax : 0
    }

    const handleGenerateChallan = () => {
        const headers = ["Employee ID,Employee Name,State,Gross Salary,PT Deduction,Month,Status"]
        const rows = ptRecords.map((r) => `${r.employeeId},${r.employeeName},${r.state},${r.grossSalary},${r.ptDeduction},${r.month},${r.status}`)
        const csv = [...headers, ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `PT_Challan_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "PT Challan Generated", description: "Professional Tax challan exported successfully." })
    }

    const handleSave = () => {
        const salary = parseFloat(formData.grossSalary) || 0
        const pt = calculatePT(formData.state, salary)

        if (editRecord) {
            updatePTRecord(editRecord.id, {
                employeeName: formData.employeeName,
                state: formData.state,
                month: formData.month,
                grossSalary: salary,
                ptDeduction: pt,
            })
            toast({ title: "Record Updated", description: `PT record for ${formData.employeeName} updated.` })
        } else {
            addPTRecord({
                id: `pt-${Date.now()}`,
                employeeId: formData.employeeId,
                employeeName: formData.employeeName,
                state: formData.state,
                month: formData.month,
                grossSalary: salary,
                ptDeduction: pt,
                status: "Pending",
            })
            toast({ title: "Record Added", description: `PT record for ${formData.employeeName} created.` })
        }
        setIsAddOpen(false)
        setEditRecord(null)
        setFormData({ employeeId: "", employeeName: "", state: "Maharashtra", month: "Mar 2026", grossSalary: "" })
    }

    const openEdit = (r: PTRecord) => {
        setEditRecord(r)
        setFormData({ employeeId: r.employeeId, employeeName: r.employeeName, state: r.state, month: r.month, grossSalary: r.grossSalary.toString() })
        setIsAddOpen(true)
    }

    // Round 2 derived data ────────────────────────────────────────────────────
    const uniqueEmployees = useMemo(() => {
        const map = new Map<string, { id: string; name: string; state: string }>()
        ptRecords.forEach(r => {
            if (!map.has(r.employeeId)) map.set(r.employeeId, { id: r.employeeId, name: r.employeeName, state: r.state })
        })
        return Array.from(map.values())
    }, [ptRecords])

    const exemptionStats = useMemo(() => {
        const active = ptExemptions.filter(e => e.status === 'Active').length
        const expired = ptExemptions.filter(e => e.status === 'Expired').length
        const typeCount = new Set(ptExemptions.map(e => e.exemptionType)).size
        return { active, expired, typeCount }
    }, [ptExemptions])

    const reconciliation = useMemo(() => {
        return ptSlabs.map(slab => {
            const stateRecs = ptRecords.filter(r => r.state === slab.state)
            const empIds = new Set(stateRecs.map(r => r.employeeId))
            const totalAmount = stateRecs.reduce((s, r) => s + r.ptDeduction, 0)
            const pendingCount = stateRecs.filter(r => r.status !== 'Paid' && r.status !== 'Filed').length
            const compliant = stateRecs.length > 0 && pendingCount === 0
            const activeExemptions = ptExemptions.filter(e => e.state === slab.state && e.status === 'Active').length
            return {
                state: slab.state,
                empCount: empIds.size,
                totalAmount,
                frequency: slab.frequency,
                compliant,
                pendingCount,
                hasRecords: stateRecs.length > 0,
                exemptionCount: activeExemptions,
            }
        })
    }, [ptRecords, ptSlabs, ptExemptions])

    const maxStateAmount = useMemo(() => Math.max(1, ...reconciliation.map(r => r.totalAmount)), [reconciliation])

    const filingDeadlines = useMemo(() => {
        return ptSlabs.map(slab => {
            const { date, label } = computeNextDueDate(slab.frequency, TODAY)
            const days = daysBetween(date, TODAY)
            return { state: slab.state, frequency: slab.frequency, dueLabel: label, days }
        })
    }, [ptSlabs])

    const isExpiringSoon = (validTo?: string) => {
        if (!validTo) return false
        const to = new Date(validTo)
        const days = daysBetween(to, TODAY)
        return days >= 0 && days <= 30
    }
    const isExpired = (validTo?: string) => {
        if (!validTo) return false
        return new Date(validTo).getTime() < TODAY.getTime()
    }

    const openExemptionAdd = () => {
        setEditExemption(null)
        setExemptionForm({ employeeId: "", employeeName: "", state: ptSlabs[0]?.state || "Maharashtra", exemptionType: "Senior Citizen", certificateNumber: "", validFrom: "", validTo: "", documentName: "", notes: "" })
        setIsExemptionOpen(true)
    }

    const openExemptionEdit = (e: PTExemption) => {
        setEditExemption(e)
        setExemptionForm({
            employeeId: e.employeeId,
            employeeName: e.employeeName,
            state: e.state,
            exemptionType: e.exemptionType,
            certificateNumber: e.certificateNumber || "",
            validFrom: e.validFrom,
            validTo: e.validTo || "",
            documentName: e.documentName || "",
            notes: e.notes || "",
        })
        setIsExemptionOpen(true)
    }

    const handleSaveExemption = () => {
        if (!exemptionForm.employeeId || !exemptionForm.validFrom) {
            toast({ title: "Missing fields", description: "Employee and Valid from are required.", variant: "destructive" })
            return
        }
        if (editExemption) {
            updatePTExemption(editExemption.id, {
                employeeId: exemptionForm.employeeId,
                employeeName: exemptionForm.employeeName,
                state: exemptionForm.state,
                exemptionType: exemptionForm.exemptionType,
                certificateNumber: exemptionForm.certificateNumber || undefined,
                validFrom: exemptionForm.validFrom,
                validTo: exemptionForm.validTo || undefined,
                documentName: exemptionForm.documentName || undefined,
                notes: exemptionForm.notes || undefined,
            })
            toast({ title: "Exemption Updated", description: `Exemption for ${exemptionForm.employeeName} updated.` })
        } else {
            addPTExemption({
                employeeId: exemptionForm.employeeId,
                employeeName: exemptionForm.employeeName,
                state: exemptionForm.state,
                exemptionType: exemptionForm.exemptionType,
                certificateNumber: exemptionForm.certificateNumber || undefined,
                validFrom: exemptionForm.validFrom,
                validTo: exemptionForm.validTo || undefined,
                documentName: exemptionForm.documentName || undefined,
                status: 'Active',
                notes: exemptionForm.notes || undefined,
            })
            toast({ title: "Exemption Added", description: `Exemption for ${exemptionForm.employeeName} created.` })
        }
        setIsExemptionOpen(false)
        setEditExemption(null)
    }

    const handleRevokeConfirm = () => {
        if (!revokeTarget) return
        updatePTExemption(revokeTarget.id, { status: 'Revoked', notes: revokeReason || revokeTarget.notes })
        toast({ title: "Exemption Revoked", description: `Exemption for ${revokeTarget.employeeName} revoked.` })
        setRevokeTarget(null)
        setRevokeReason("")
    }

    const toggleExemptionSelect = (id: string) => {
        setSelectedExemptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    const handleBulkStatus = (status: PTExemption['status']) => {
        bulkUpdatePTExemptionStatus(selectedExemptions, status)
        toast({ title: "Bulk Update", description: `${selectedExemptions.length} exemption(s) marked ${status}.` })
        setSelectedExemptions([])
    }

    const handleImportExemptions = () => {
        toast({ title: "Import started", description: "CSV import simulated for demo." })
    }

    const handleRemindTeam = (state: string) => {
        toast({ title: "Reminder scheduled", description: `Filing reminder set for ${state}.` })
    }

    const handleGenerateStateChallan = (state: string) => {
        toast({ title: "Challan generated", description: `PT challan for ${state} exported.` })
    }

    const exemptionStatusColor = (s: PTExemption['status']) => {
        switch (s) {
            case 'Active': return 'bg-emerald-50 text-emerald-600'
            case 'Expired': return 'bg-rose-50 text-rose-600'
            case 'Revoked': return 'bg-slate-100 text-slate-500'
            default: return 'bg-slate-50 text-slate-500'
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => router.push("/hrmcubicle/payroll/statutory")}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Professional Tax Management</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">State-wise PT Deductions & Filings</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={handleGenerateChallan}>
                        <Download size={14} /> Generate Challan
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={() => { setEditRecord(null); setFormData({ employeeId: "", employeeName: "", state: "Maharashtra", month: "Mar 2026", grossSalary: "" }); setIsAddOpen(true) }}>
                        <Plus size={14} /> Add Record
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-8 pb-32">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total PT Deductions", val: `₹${stats.totalPT.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: "This month" },
                            { label: "States Covered", val: stats.stateCount.toString(), icon: MapPin, color: "text-blue-500", bg: "bg-blue-50", trend: "Active states" },
                            { label: "Employees Under PT", val: stats.total.toString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50", trend: "All states" },
                            { label: "Filing Rate", val: `${stats.total > 0 ? Math.round((stats.filed / stats.total) * 100) : 0}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50", trend: `${stats.filed}/${stats.total} filed` },
                        ].map((stat, i) => (
                            <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-slate-50">{stat.trend}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* State-wise PT Slabs */}
                    <div>
                        <h2 className="text-sm font-bold text-slate-700 mb-4">State-wise PT Slabs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ptSlabs.map((slab) => (
                                <Card key={slab.state} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => setSlabDialogState(slab.state)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                                <MapPin size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">{slab.state}</p>
                                                <p className="text-[10px] text-slate-400">{slab.frequency} filing</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {slab.slabs.slice(0, 3).map((sl, i) => (
                                                <div key={i} className="flex items-center justify-between text-[10px]">
                                                    <span className="text-slate-400">₹{sl.from.toLocaleString("en-IN")} - ₹{sl.to >= 999999 ? "Above" : sl.to.toLocaleString("en-IN")}</span>
                                                    <span className="font-bold text-slate-600">₹{sl.tax}</span>
                                                </div>
                                            ))}
                                            {slab.slabs.length > 3 && <p className="text-[10px] text-[#8B5CF6] font-medium">+{slab.slabs.length - 3} more slabs...</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input placeholder="Search by name or ID..." className="pl-9 h-10 rounded-lg border-slate-200 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Select value={stateFilter} onValueChange={setStateFilter}>
                            <SelectTrigger className="w-[160px] h-10 rounded-lg border-slate-200 text-xs font-medium">
                                <MapPin size={12} className="mr-1.5" />
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
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

                    {/* Employee PT Table */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Employee PT Deductions</h3>
                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{filtered.length} records</Badge>
                            </div>
                            <ScrollArea className="max-h-[380px]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr>
                                            {["Employee", "State", "Gross Salary", "PT Deduction", "Month", "Status", "Actions"].map((h) => (
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
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className="font-bold text-[9px] text-slate-500 border-slate-200">{r.state}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{r.grossSalary.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3 text-xs font-bold text-[#8B5CF6]">₹{r.ptDeduction}</td>
                                                <td className="px-4 py-3 text-xs text-slate-500">{r.month}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.status))}>{r.status}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => openEdit(r)}>
                                                            <Pencil size={12} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500" onClick={() => { deletePTRecord(r.id); toast({ title: "Deleted", description: `PT record for ${r.employeeName} removed.` }) }}>
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

                    {/* Filing Tracker */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                                <FileText size={16} className="text-blue-500" />
                                <h3 className="text-sm font-bold text-slate-900">PT Filing Tracker</h3>
                            </div>
                            <div className="p-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {["State", "Period", "Frequency", "Due Date", "Status"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filingTracker.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-none">
                                                <td className="py-3 text-xs font-bold text-slate-700">{row.state}</td>
                                                <td className="py-3 text-xs text-slate-600">{row.period}</td>
                                                <td className="py-3"><Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-200">{row.frequency}</Badge></td>
                                                <td className="py-3 text-xs text-slate-500">{row.dueDate}</td>
                                                <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(row.status))}>{row.status}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ══════════ ROUND 2: PT EXEMPTIONS ══════════ */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">PT exemptions</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Tax-exempt employees (senior citizens, disability, ex-servicemen)</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-9 border-slate-200 rounded-lg font-bold text-xs gap-2 px-3 shadow-sm hover:bg-slate-50 text-slate-600" onClick={handleImportExemptions}>
                                        <Upload size={12} /> Import
                                    </Button>
                                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={openExemptionAdd}>
                                        <Plus size={12} /> New exemption
                                    </Button>
                                </div>
                            </div>

                            {/* Mini stats */}
                            <div className="grid grid-cols-3 gap-4 p-5 border-b border-slate-100 bg-slate-50/40">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active exemptions</p>
                                        <p className="text-lg font-bold text-slate-900 tabular-nums">{exemptionStats.active}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                        <Ban size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired exemptions</p>
                                        <p className="text-lg font-bold text-slate-900 tabular-nums">{exemptionStats.expired}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                                        <Info size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exemption types</p>
                                        <p className="text-lg font-bold text-slate-900 tabular-nums">{exemptionStats.typeCount}</p>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="max-h-[420px]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr>
                                            <th className="w-8 px-4 py-3"></th>
                                            {["Employee", "State", "Type", "Certificate", "Validity", "Status", ""].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ptExemptions.length === 0 && (
                                            <tr><td colSpan={8} className="text-center py-10 text-xs text-slate-400">No exemptions recorded yet.</td></tr>
                                        )}
                                        {ptExemptions.map((e) => {
                                            const meta = exemptionTypeMeta[e.exemptionType]
                                            const Icon = meta.icon
                                            const expSoon = isExpiringSoon(e.validTo)
                                            const exp = isExpired(e.validTo)
                                            return (
                                                <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <Checkbox checked={selectedExemptions.includes(e.id)} onCheckedChange={() => toggleExemptionSelect(e.id)} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs font-bold text-slate-700">{e.employeeName}</p>
                                                        <p className="text-[10px] text-slate-400">{e.employeeId}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="outline" className="font-bold text-[9px] text-slate-500 border-slate-200">{e.state}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5 gap-1 inline-flex items-center", meta.bg, meta.color)}>
                                                            <Icon size={10} /> {e.exemptionType}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs font-medium text-slate-700 tabular-nums">{e.certificateNumber || <span className="text-slate-400">—</span>}</p>
                                                        {e.documentName && (
                                                            <button className="text-[10px] text-[#8B5CF6] hover:underline font-semibold inline-flex items-center gap-1" onClick={() => toast({ title: "Document", description: e.documentName })}>
                                                                <Eye size={10} /> View document
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className={cn("text-[11px] tabular-nums font-medium", exp ? "text-red-600" : expSoon ? "text-rose-600" : "text-slate-600")}>
                                                            {e.validFrom} → {e.validTo || "—"}
                                                        </p>
                                                        {expSoon && !exp && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Expiring soon</p>}
                                                        {exp && <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Expired</p>}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5", exemptionStatusColor(e.status))}>{e.status}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]">
                                                                    <MoreHorizontal size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                                <DropdownMenuItem className="text-xs gap-2" onClick={() => openExemptionEdit(e)}>
                                                                    <Edit size={12} /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-xs gap-2" onClick={() => setRevokeTarget(e)}>
                                                                    <Ban size={12} /> Revoke
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-xs gap-2" onClick={() => { updatePTExemption(e.id, { status: 'Active' }); toast({ title: "Marked Active" }) }}>
                                                                    <CheckCircle2 size={12} /> Mark Active
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-xs gap-2" onClick={() => { updatePTExemption(e.id, { status: 'Expired' }); toast({ title: "Marked Expired" }) }}>
                                                                    <CalendarDays size={12} /> Mark Expired
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-xs gap-2 text-red-600 focus:text-red-600" onClick={() => { deletePTExemption(e.id); toast({ title: "Deleted" }) }}>
                                                                    <Trash2 size={12} /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* ══════════ ROUND 2: MULTI-STATE RECONCILIATION ══════════ */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Multi-state reconciliation</h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">Compare PT deductions across states for compliance</p>
                            </div>
                            <div className="p-5">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {["State", "Employees", "Monthly PT", "Frequency", "Compliance", "Exemptions", "Actions"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reconciliation.map((row) => (
                                            <tr key={row.state} className="border-b border-slate-50 last:border-none">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                                            <MapPin size={12} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{row.state}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-xs font-bold text-slate-700 tabular-nums">{row.empCount}</td>
                                                <td className="py-3 text-xs font-bold text-[#8B5CF6] tabular-nums">{formatINR(row.totalAmount)}</td>
                                                <td className="py-3">
                                                    <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-200">{row.frequency}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    {row.hasRecords ? (
                                                        row.compliant ? (
                                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[10px] px-2 py-0.5">Compliant</Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-50 text-amber-600 border-none font-semibold text-[10px] px-2 py-0.5">Pending {row.pendingCount}</Badge>
                                                        )
                                                    ) : (
                                                        <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[10px] px-2 py-0.5">No records</Badge>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-semibold text-[10px] px-2 py-0.5 tabular-nums">{row.exemptionCount}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] font-bold px-2.5 gap-1 border-slate-200" onClick={() => setDrillState(row.state)}>
                                                            <Eye size={11} /> View
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] font-bold px-2.5 gap-1 border-slate-200 text-[#8B5CF6] hover:bg-[#8B5CF6]/5" onClick={() => handleGenerateStateChallan(row.state)}>
                                                            <FileCheck size={11} /> Challan
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Bar chart */}
                                <div className="mt-6 pt-5 border-t border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">PT amount by state</p>
                                    <div className="space-y-2.5">
                                        {reconciliation.filter(r => r.totalAmount > 0).sort((a, b) => b.totalAmount - a.totalAmount).map(row => (
                                            <div key={row.state} className="flex items-center gap-3">
                                                <div className="w-28 text-xs font-bold text-slate-600">{row.state}</div>
                                                <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden relative">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#a78bfa] rounded-lg transition-all"
                                                        style={{ width: `${Math.max(4, (row.totalAmount / maxStateAmount) * 100)}%` }}
                                                    />
                                                </div>
                                                <div className="w-24 text-xs font-bold text-slate-700 tabular-nums text-right">{formatINR(row.totalAmount)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ══════════ ROUND 2: STATE FILING DEADLINES ══════════ */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                                <CalendarDays size={16} className="text-[#8B5CF6]" />
                                <h3 className="text-sm font-bold text-slate-900">State filing deadlines</h3>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filingDeadlines.map(d => {
                                    const urgent = d.days <= 7
                                    const soon = d.days <= 15 && d.days > 7
                                    return (
                                        <div key={d.state} className={cn(
                                            "rounded-2xl border p-4 transition-all hover:shadow-md",
                                            urgent ? "border-rose-200 bg-rose-50/30" : soon ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-white"
                                        )}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center",
                                                        urgent ? "bg-rose-100 text-rose-600" : soon ? "bg-amber-100 text-amber-600" : "bg-blue-50 text-blue-500"
                                                    )}>
                                                        <MapPin size={14} />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700">{d.state}</p>
                                                </div>
                                                <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-200">{d.frequency}</Badge>
                                            </div>
                                            <div className="space-y-1 mb-3">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next due</p>
                                                <p className="text-sm font-bold text-slate-900 tabular-nums">{d.dueLabel}</p>
                                                <p className={cn("text-[11px] font-semibold tabular-nums",
                                                    urgent ? "text-rose-600" : soon ? "text-amber-600" : "text-slate-500"
                                                )}>
                                                    {d.days === 0 ? "Due today" : d.days < 0 ? `Overdue ${Math.abs(d.days)}d` : `${d.days} days remaining`}
                                                </p>
                                            </div>
                                            <Button variant="outline" className="w-full h-8 rounded-lg text-[10px] font-bold gap-1.5 border-slate-200 hover:bg-[#8B5CF6]/5 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/30" onClick={() => handleRemindTeam(d.state)}>
                                                <Bell size={11} /> Remind team
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Floating bulk bar */}
            {selectedExemptions.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 tabular-nums">{selectedExemptions.length} selected</span>
                    <div className="h-5 w-px bg-slate-200" />
                    <Button size="sm" className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold gap-1.5" onClick={() => handleBulkStatus('Active')}>
                        <CheckCircle2 size={12} /> Mark Active
                    </Button>
                    <Button size="sm" className="h-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold gap-1.5" onClick={() => handleBulkStatus('Expired')}>
                        <CalendarDays size={12} /> Mark Expired
                    </Button>
                    <Button size="sm" className="h-8 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-[11px] font-bold gap-1.5" onClick={() => handleBulkStatus('Revoked')}>
                        <Ban size={12} /> Mark Revoked
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[11px] font-bold text-slate-500" onClick={() => setSelectedExemptions([])}>
                        Clear
                    </Button>
                </div>
            )}

            {/* Slab Detail Dialog */}
            <Dialog open={!!slabDialogState} onOpenChange={() => setSlabDialogState(null)}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">PT Slabs - {slabDialogState}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Professional Tax rate structure for {slabDialogState}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        {slabDialogState && ptSlabs.find((s) => s.state === slabDialogState) && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="font-bold text-[9px] text-slate-500 border-slate-200">
                                        {ptSlabs.find((s) => s.state === slabDialogState)?.frequency} Filing
                                    </Badge>
                                </div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-[10px] font-bold text-slate-400 pb-2 text-left">Salary Range</th>
                                            <th className="text-[10px] font-bold text-slate-400 pb-2 text-right">Tax Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ptSlabs.find((s) => s.state === slabDialogState)?.slabs.map((sl, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-none">
                                                <td className="py-2.5 text-xs text-slate-600">
                                                    ₹{sl.from.toLocaleString("en-IN")} - {sl.to >= 999999 ? "Above" : `₹${sl.to.toLocaleString("en-IN")}`}
                                                </td>
                                                <td className="py-2.5 text-xs font-bold text-slate-700 text-right">₹{sl.tax}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => setSlabDialogState(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) setEditRecord(null) }}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editRecord ? "Edit PT Record" : "Add PT Record"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editRecord ? "Update the PT deduction details." : "Enter employee details. PT will be auto-calculated based on state slabs."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee ID</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} disabled={!!editRecord} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee Name</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">State</Label>
                                <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                                    <SelectTrigger className="h-9 text-xs rounded-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ptSlabs.map((s) => <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Month</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Gross Salary (₹)</Label>
                            <Input className="h-9 text-xs rounded-lg" type="number" value={formData.grossSalary} onChange={(e) => setFormData({ ...formData, grossSalary: e.target.value })} />
                        </div>
                        {formData.grossSalary && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculated PT</p>
                                <p className="text-lg font-bold text-[#8B5CF6]">₹{calculatePT(formData.state, parseFloat(formData.grossSalary))}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Based on {formData.state} slab rates</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setIsAddOpen(false); setEditRecord(null) }}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white h-9 rounded-lg text-xs font-bold shadow-lg shadow-[#8B5CF6]/20" onClick={handleSave}>
                            {editRecord ? "Update" : "Add Record"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exemption Add/Edit Dialog */}
            <Dialog open={isExemptionOpen} onOpenChange={(o) => { setIsExemptionOpen(o); if (!o) setEditExemption(null) }}>
                <DialogContent className="sm:max-w-[560px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editExemption ? "Edit Exemption" : "New Exemption"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Record a PT exemption (senior citizen, disability, ex-servicemen etc).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee</Label>
                                <Select
                                    value={exemptionForm.employeeId}
                                    onValueChange={(v) => {
                                        const emp = uniqueEmployees.find(e => e.id === v)
                                        setExemptionForm({ ...exemptionForm, employeeId: v, employeeName: emp?.name || "", state: emp?.state || exemptionForm.state })
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-xs rounded-lg">
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueEmployees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">State</Label>
                                <Select value={exemptionForm.state} onValueChange={(v) => setExemptionForm({ ...exemptionForm, state: v })}>
                                    <SelectTrigger className="h-9 text-xs rounded-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ptSlabs.map(s => <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exemption Type</Label>
                            <Select value={exemptionForm.exemptionType} onValueChange={(v) => setExemptionForm({ ...exemptionForm, exemptionType: v as PTExemption['exemptionType'] })}>
                                <SelectTrigger className="h-9 text-xs rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                                    <SelectItem value="Disability">Disability</SelectItem>
                                    <SelectItem value="Parents of Disabled Child">Parents of Disabled Child</SelectItem>
                                    <SelectItem value="Ex-Servicemen">Ex-Servicemen</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Certificate Number</Label>
                            <Input className="h-9 text-xs rounded-lg" value={exemptionForm.certificateNumber} onChange={(e) => setExemptionForm({ ...exemptionForm, certificateNumber: e.target.value })} placeholder="e.g. SR-MH-2025-78912" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valid From</Label>
                                <Input type="date" className="h-9 text-xs rounded-lg" value={exemptionForm.validFrom} onChange={(e) => setExemptionForm({ ...exemptionForm, validFrom: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valid To</Label>
                                <Input type="date" className="h-9 text-xs rounded-lg" value={exemptionForm.validTo} onChange={(e) => setExemptionForm({ ...exemptionForm, validTo: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Name</Label>
                            <Input className="h-9 text-xs rounded-lg" value={exemptionForm.documentName} onChange={(e) => setExemptionForm({ ...exemptionForm, documentName: e.target.value })} placeholder="e.g. senior_cert.pdf" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notes</Label>
                            <Textarea className="min-h-[60px] text-xs rounded-lg" value={exemptionForm.notes} onChange={(e) => setExemptionForm({ ...exemptionForm, notes: e.target.value })} placeholder="Optional context..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setIsExemptionOpen(false); setEditExemption(null) }}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white h-9 rounded-lg text-xs font-bold shadow-lg shadow-[#8B5CF6]/20" onClick={handleSaveExemption}>
                            {editExemption ? "Update" : "Save Exemption"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Confirm Dialog */}
            <Dialog open={!!revokeTarget} onOpenChange={(o) => { if (!o) { setRevokeTarget(null); setRevokeReason("") } }}>
                <DialogContent className="sm:max-w-[440px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Ban size={18} className="text-rose-500" /> Revoke exemption
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            This will mark the exemption as Revoked. PT deduction will resume for {revokeTarget?.employeeName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 space-y-3">
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Employee</p>
                            <p className="text-sm font-bold text-slate-900">{revokeTarget?.employeeName}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{revokeTarget?.exemptionType} • {revokeTarget?.state}</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reason</Label>
                            <Textarea className="min-h-[80px] text-xs rounded-lg" value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)} placeholder="Reason for revocation..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setRevokeTarget(null); setRevokeReason("") }}>Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white h-9 rounded-lg text-xs font-bold" onClick={handleRevokeConfirm}>
                            Confirm Revoke
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* State Employees Drill-down Dialog */}
            <Dialog open={!!drillState} onOpenChange={(o) => { if (!o) setDrillState(null) }}>
                <DialogContent className="sm:max-w-[720px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <MapPin size={18} className="text-[#8B5CF6]" /> {drillState} — Employees
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            PT records and active exemptions for employees in {drillState}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 max-h-[60vh] overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-slate-100">
                                    {["Employee", "Gross", "PT", "Month", "Status", "Exemption"].map((h) => (
                                        <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {drillState && ptRecords.filter(r => r.state === drillState).map((r) => {
                                    const ex = ptExemptions.find(e => e.employeeId === r.employeeId && e.state === drillState && e.status === 'Active')
                                    return (
                                        <tr key={r.id} className="border-b border-slate-50 last:border-none">
                                            <td className="py-3">
                                                <p className="text-xs font-bold text-slate-700">{r.employeeName}</p>
                                                <p className="text-[10px] text-slate-400">{r.employeeId}</p>
                                            </td>
                                            <td className="py-3 text-xs font-bold text-slate-700 tabular-nums">{formatINR(r.grossSalary)}</td>
                                            <td className="py-3 text-xs font-bold text-[#8B5CF6] tabular-nums">{formatINR(r.ptDeduction)}</td>
                                            <td className="py-3 text-xs text-slate-500">{r.month}</td>
                                            <td className="py-3">
                                                <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5", statusColor(r.status))}>{r.status}</Badge>
                                            </td>
                                            <td className="py-3">
                                                {ex ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[10px] px-2 py-0.5">{ex.exemptionType}</Badge>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {drillState && ptRecords.filter(r => r.state === drillState).length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-10 text-xs text-slate-400">No employees registered for {drillState}.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => setDrillState(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PTManagement
