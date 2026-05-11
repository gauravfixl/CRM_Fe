"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldCheck,
    ChevronLeft,
    Plus,
    Download,
    Users,
    IndianRupee,
    FileText,
    TrendingUp,
    Pencil,
    Trash2,
    Search,
    Filter,
    AlertTriangle,
    CheckCircle2,
    Info,
    UserMinus,
    Shield,
    Activity,
    Baby,
    Heart,
    MoreHorizontal,
    Edit,
    Scan,
    LogOut,
    ClipboardList,
    Accessibility,
    CircleHelp,
    Eye,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
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
import { useToast } from "@/shared/components/ui/use-toast"
import { useStatutoryStore, ESIRecord, ESIBreach, ESIBenefitClaim } from "@/shared/data/statutory-store"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/lib/utils"

const ESI_WAGE_LIMIT = 21000
const ESI_EE_RATE = 0.0075
const ESI_ER_RATE = 0.0325

const ESIManagement = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        esiRecords,
        addESIRecord,
        updateESIRecord,
        deleteESIRecord,
        esiBreaches,
        esiBenefitClaims,
        addESIBreach,
        updateESIBreach,
        autoDetectESIBreaches,
        exitEmployeeFromESI,
        addESIBenefitClaim,
        updateESIBenefitClaim,
        deleteESIBenefitClaim,
    } = useStatutoryStore()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editRecord, setEditRecord] = useState<ESIRecord | null>(null)
    const [formData, setFormData] = useState({ employeeId: "", employeeName: "", esicNumber: "", month: "Mar 2026", grossWage: "" })

    // Round 2 state
    const [ceilingInput, setCeilingInput] = useState<number>(21000)
    const [autoDetectResult, setAutoDetectResult] = useState<number | null>(null)
    const [isExitOpen, setIsExitOpen] = useState(false)
    const [exitTarget, setExitTarget] = useState<ESIBreach | null>(null)
    const [exitDate, setExitDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [isBreachViewOpen, setIsBreachViewOpen] = useState(false)
    const [breachView, setBreachView] = useState<ESIBreach | null>(null)
    const [isBreachEditOpen, setIsBreachEditOpen] = useState(false)
    const [breachEdit, setBreachEdit] = useState<ESIBreach | null>(null)
    const [breachEditNotes, setBreachEditNotes] = useState("")
    const [breachEditAction, setBreachEditAction] = useState<'Flagged' | 'Continued' | 'Exited'>('Flagged')
    const [isClaimOpen, setIsClaimOpen] = useState(false)
    const [claimEdit, setClaimEdit] = useState<ESIBenefitClaim | null>(null)
    const [claimForm, setClaimForm] = useState<{
        employeeId: string
        employeeName: string
        benefitType: ESIBenefitClaim['benefitType']
        claimDate: string
        amount: string
        durationDays: string
        notes: string
    }>({
        employeeId: "",
        employeeName: "",
        benefitType: "Sickness",
        claimDate: new Date().toISOString().split("T")[0],
        amount: "",
        durationDays: "",
        notes: "",
    })

    const formatINR = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

    const filtered = useMemo(() => {
        return esiRecords.filter((r) => {
            const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase()) || r.esicNumber.includes(search)
            const matchStatus = statusFilter === "all" || r.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [esiRecords, search, statusFilter])

    const stats = useMemo(() => {
        const eligible = esiRecords.filter((r) => r.grossWage <= ESI_WAGE_LIMIT).length
        const totalEE = esiRecords.reduce((s, r) => s + r.esiEmployee, 0)
        const totalER = esiRecords.reduce((s, r) => s + r.esiEmployer, 0)
        const filed = esiRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        return { eligible, total: esiRecords.length, totalEE, totalER, totalContribution: totalEE + totalER, filed }
    }, [esiRecords])

    const halfYearlyTracker = [
        { period: "Apr 2025 - Sep 2025", returnStatus: "Filed", challanStatus: "Paid", filingDate: "11 Nov 2025" },
        { period: "Oct 2025 - Mar 2026", returnStatus: "Pending", challanStatus: "Pending", filingDate: "Due: 12 May 2026" },
    ]

    const statusColor = (s: string) => {
        switch (s) {
            case "Paid": case "Completed": return "bg-emerald-50 text-emerald-600"
            case "Filed": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const handleGenerateChallan = () => {
        const headers = ["ESIC Number,Employee Name,Gross Wage,Employee Contribution (0.75%),Employer Contribution (3.25%),Total,Month"]
        const rows = esiRecords.map((r) => `${r.esicNumber},${r.employeeName},${r.grossWage},${r.esiEmployee},${r.esiEmployer},${r.esiEmployee + r.esiEmployer},${r.month}`)
        const csv = [...headers, ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ESI_Challan_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "ESI Challan Generated", description: "Monthly ESI challan exported successfully." })
    }

    const handleSave = () => {
        const wage = parseFloat(formData.grossWage) || 0
        const ee = Math.round(wage * ESI_EE_RATE)
        const er = Math.round(wage * ESI_ER_RATE)

        if (editRecord) {
            updateESIRecord(editRecord.id, {
                employeeName: formData.employeeName,
                esicNumber: formData.esicNumber,
                month: formData.month,
                grossWage: wage,
                esiEmployee: ee,
                esiEmployer: er,
            })
            toast({ title: "Record Updated", description: `ESI record for ${formData.employeeName} updated.` })
        } else {
            addESIRecord({
                id: `esi-${Date.now()}`,
                employeeId: formData.employeeId,
                employeeName: formData.employeeName,
                esicNumber: formData.esicNumber,
                month: formData.month,
                grossWage: wage,
                esiEmployee: ee,
                esiEmployer: er,
                status: "Pending",
            })
            toast({ title: "Record Added", description: `ESI record for ${formData.employeeName} created.` })
        }
        setIsAddOpen(false)
        setEditRecord(null)
        setFormData({ employeeId: "", employeeName: "", esicNumber: "", month: "Mar 2026", grossWage: "" })
    }

    const openEdit = (r: ESIRecord) => {
        setEditRecord(r)
        setFormData({ employeeId: r.employeeId, employeeName: r.employeeName, esicNumber: r.esicNumber, month: r.month, grossWage: r.grossWage.toString() })
        setIsAddOpen(true)
    }

    const handleDelete = (id: string, name: string) => {
        deleteESIRecord(id)
        toast({ title: "Record Deleted", description: `ESI record for ${name} removed.` })
    }

    // --- Round 2 handlers ---
    const handleAutoDetect = () => {
        const result = autoDetectESIBreaches(ceilingInput)
        toast({
            title: "Auto-detect complete",
            description: `${result.flagged} new breach${result.flagged === 1 ? '' : 'es'} flagged at ceiling ${formatINR(ceilingInput)}.`,
        })
        if (result.flagged > 0) {
            setAutoDetectResult(result.flagged)
        }
    }

    const openExit = (b: ESIBreach) => {
        setExitTarget(b)
        setExitDate(new Date().toISOString().split("T")[0])
        setIsExitOpen(true)
    }

    const handleConfirmExit = () => {
        if (!exitTarget) return
        exitEmployeeFromESI(exitTarget.id, exitDate)
        toast({ title: "Employee exited from ESI", description: `${exitTarget.employeeName} marked as exited effective ${exitDate}.` })
        setIsExitOpen(false)
        setExitTarget(null)
    }

    const openBreachView = (b: ESIBreach) => {
        setBreachView(b)
        setIsBreachViewOpen(true)
    }

    const openBreachEdit = (b: ESIBreach) => {
        setBreachEdit(b)
        setBreachEditNotes(b.notes || "")
        setBreachEditAction(b.action)
        setIsBreachEditOpen(true)
    }

    const handleBreachEditSave = () => {
        if (!breachEdit) return
        updateESIBreach(breachEdit.id, { notes: breachEditNotes, action: breachEditAction })
        toast({ title: "Breach updated", description: `${breachEdit.employeeName} breach record updated.` })
        setIsBreachEditOpen(false)
        setBreachEdit(null)
    }

    const openNewClaim = () => {
        setClaimEdit(null)
        setClaimForm({
            employeeId: "",
            employeeName: "",
            benefitType: "Sickness",
            claimDate: new Date().toISOString().split("T")[0],
            amount: "",
            durationDays: "",
            notes: "",
        })
        setIsClaimOpen(true)
    }

    const openEditClaim = (c: ESIBenefitClaim) => {
        setClaimEdit(c)
        setClaimForm({
            employeeId: c.employeeId,
            employeeName: c.employeeName,
            benefitType: c.benefitType,
            claimDate: c.claimDate,
            amount: c.amount != null ? String(c.amount) : "",
            durationDays: c.durationDays != null ? String(c.durationDays) : "",
            notes: c.notes || "",
        })
        setIsClaimOpen(true)
    }

    const handleClaimSave = () => {
        if (!claimForm.employeeId || !claimForm.employeeName) {
            toast({ title: "Missing employee", description: "Please select an employee.", variant: "destructive" })
            return
        }
        const payload = {
            employeeId: claimForm.employeeId,
            employeeName: claimForm.employeeName,
            benefitType: claimForm.benefitType,
            claimDate: claimForm.claimDate,
            amount: claimForm.amount ? parseFloat(claimForm.amount) : undefined,
            durationDays: claimForm.durationDays ? parseInt(claimForm.durationDays) : undefined,
            notes: claimForm.notes || undefined,
        }
        if (claimEdit) {
            updateESIBenefitClaim(claimEdit.id, payload)
            toast({ title: "Claim updated", description: `${payload.benefitType} claim for ${payload.employeeName} updated.` })
        } else {
            addESIBenefitClaim({ ...payload, status: "Submitted" })
            toast({ title: "Claim submitted", description: `${payload.benefitType} claim for ${payload.employeeName} created.` })
        }
        setIsClaimOpen(false)
        setClaimEdit(null)
    }

    const handleMarkSettled = (c: ESIBenefitClaim) => {
        updateESIBenefitClaim(c.id, { status: "Settled", settledDate: new Date().toISOString().split("T")[0] })
        toast({ title: "Claim settled", description: `${c.employeeName}'s ${c.benefitType} claim marked settled.` })
    }

    const handleClaimDelete = (c: ESIBenefitClaim) => {
        deleteESIBenefitClaim(c.id)
        toast({ title: "Claim deleted", description: `${c.employeeName}'s claim removed.` })
    }

    // --- Derived Round 2 data ---
    const breachActionColor = (a: ESIBreach['action']) => {
        switch (a) {
            case 'Flagged': return 'bg-amber-50 text-amber-600'
            case 'Continued': return 'bg-indigo-50 text-indigo-600'
            case 'Exited': return 'bg-rose-50 text-rose-600'
            default: return 'bg-slate-50 text-slate-500'
        }
    }

    const claimStatusColor = (s: ESIBenefitClaim['status']) => {
        switch (s) {
            case 'Submitted': return 'bg-amber-50 text-amber-600'
            case 'Approved': return 'bg-blue-50 text-blue-600'
            case 'Settled': return 'bg-emerald-50 text-emerald-600'
            case 'Rejected': return 'bg-rose-50 text-rose-600'
            default: return 'bg-slate-50 text-slate-500'
        }
    }

    const benefitIconMap: Record<ESIBenefitClaim['benefitType'], React.ElementType> = {
        Sickness: Activity,
        Maternity: Baby,
        Disablement: Accessibility,
        Dependent: Users,
        Medical: Heart,
        Funeral: CircleHelp,
    }

    const benefitBadgeColor = (t: ESIBenefitClaim['benefitType']) => {
        switch (t) {
            case 'Sickness': return 'bg-amber-50 text-amber-600'
            case 'Maternity': return 'bg-pink-50 text-pink-600'
            case 'Disablement': return 'bg-indigo-50 text-indigo-600'
            case 'Dependent': return 'bg-blue-50 text-blue-600'
            case 'Medical': return 'bg-rose-50 text-rose-600'
            case 'Funeral': return 'bg-slate-100 text-slate-600'
            default: return 'bg-slate-50 text-slate-500'
        }
    }

    const claimStats = useMemo(() => {
        const total = esiBenefitClaims.length
        const settled = esiBenefitClaims.filter(c => c.status === 'Settled').length
        const totalAmount = esiBenefitClaims.reduce((s, c) => s + (c.amount || 0), 0)
        const avg = total > 0 ? totalAmount / total : 0
        return { total, settled, totalAmount, avg }
    }, [esiBenefitClaims])

    const uniqueEmployees = useMemo(() => {
        const seen = new Map<string, { employeeId: string; employeeName: string; esicNumber: string }>()
        esiRecords.forEach(r => {
            if (!seen.has(r.employeeId)) {
                seen.set(r.employeeId, { employeeId: r.employeeId, employeeName: r.employeeName, esicNumber: r.esicNumber })
            }
        })
        return Array.from(seen.values())
    }, [esiRecords])

    const priorRecordsForBreach = useMemo(() => {
        if (!breachView) return []
        return esiRecords.filter(r => r.employeeId === breachView.employeeId)
    }, [esiRecords, breachView])

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => router.push("/hrmcubicle/payroll/statutory")}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">ESI Management</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">Employee State Insurance - Contributions & Challans</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={handleGenerateChallan}>
                        <Download size={14} /> Generate Challan
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={() => { setEditRecord(null); setFormData({ employeeId: "", employeeName: "", esicNumber: "", month: "Mar 2026", grossWage: "" }); setIsAddOpen(true) }}>
                        <Plus size={14} /> Add Record
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-8 pb-32">
                    {/* ESI Wage Limit Alert */}
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                        <Info size={18} className="text-blue-500 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-blue-700">ESI Wage Limit: ₹21,000/month</p>
                            <p className="text-[10px] text-blue-500 mt-0.5">Employees with gross wages exceeding ₹21,000/month are not eligible for ESI. Employee contribution: 0.75% | Employer contribution: 3.25%</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "ESI Eligible Employees", val: stats.eligible.toString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50", trend: `of ${stats.total} total` },
                            { label: "Total ESI Contribution", val: `₹${stats.totalContribution.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: `EE: ₹${stats.totalEE} + ER: ₹${stats.totalER}` },
                            { label: "Challan Status", val: "Pending", icon: FileText, color: "text-amber-500", bg: "bg-amber-50", trend: "Mar 2026" },
                            { label: "Compliance Rate", val: `${stats.total > 0 ? Math.round((stats.filed / stats.total) * 100) : 0}%`, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50", trend: `${stats.filed}/${stats.total} filed` },
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
                            <Input placeholder="Search by name, ID, or ESIC No..." className="pl-9 h-10 rounded-lg border-slate-200 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
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

                    {/* Employee ESI Table */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Employee ESI Contributions</h3>
                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{filtered.length} records</Badge>
                            </div>
                            <ScrollArea className="max-h-[420px]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr>
                                            {["Employee", "ESIC Number", "Gross Wage", "Eligible", "EE (0.75%)", "ER (3.25%)", "Total", "Status", "Actions"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r) => {
                                            const isEligible = r.grossWage <= ESI_WAGE_LIMIT
                                            return (
                                                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs font-bold text-slate-700">{r.employeeName}</p>
                                                        <p className="text-[10px] text-slate-400">{r.employeeId}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{r.esicNumber}</td>
                                                    <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{r.grossWage.toLocaleString("en-IN")}</td>
                                                    <td className="px-4 py-3">
                                                        {isEligible ? (
                                                            <Badge className="border-none font-bold text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600">Yes</Badge>
                                                        ) : (
                                                            <Badge className="border-none font-bold text-[9px] px-2 py-0.5 bg-red-50 text-red-500">No</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.esiEmployee.toLocaleString("en-IN")}</td>
                                                    <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.esiEmployer.toLocaleString("en-IN")}</td>
                                                    <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{(r.esiEmployee + r.esiEmployer).toLocaleString("en-IN")}</td>
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
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Half-Yearly Return Tracker */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Half-Yearly Return Tracker</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">ESI returns are filed half-yearly (Form 5 / Form 6)</p>
                            </div>
                            <div className="p-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {["Period", "Return Status", "Challan Status", "Filing Date"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {halfYearlyTracker.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-none">
                                                <td className="py-3 text-xs font-bold text-slate-700">{row.period}</td>
                                                <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(row.returnStatus))}>{row.returnStatus}</Badge></td>
                                                <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(row.challanStatus))}>{row.challanStatus}</Badge></td>
                                                <td className="py-3 text-xs text-slate-500">{row.filingDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Wage Ceiling Breaches */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                        <AlertTriangle size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Wage ceiling breaches</h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Employees whose gross wage crossed the ESI ceiling — review, continue or exit.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ceiling (₹)</Label>
                                        <Input
                                            type="number"
                                            value={ceilingInput}
                                            onChange={(e) => setCeilingInput(parseInt(e.target.value) || 0)}
                                            className="h-9 w-[120px] text-xs rounded-lg border-slate-200"
                                        />
                                    </div>
                                    <Button
                                        className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-sm gap-2 mt-4"
                                        onClick={handleAutoDetect}
                                    >
                                        <Scan size={14} /> Auto-detect breaches
                                    </Button>
                                </div>
                            </div>
                            <ScrollArea className="max-h-[420px]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr>
                                            {["Employee", "Breach Month", "Breach Wage", "Ceiling", "Action", "Exit Date", "Notes", "Actions"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {esiBreaches.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-12 text-center text-xs text-slate-400">
                                                    No breaches flagged. Run auto-detect to scan current ESI records.
                                                </td>
                                            </tr>
                                        ) : esiBreaches.map((b) => (
                                            <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="text-xs font-bold text-slate-700">{b.employeeName}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{b.esicNumber}</p>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">{b.breachMonth}</td>
                                                <td className="px-4 py-3 text-xs font-bold text-rose-600">{formatINR(b.breachGrossWage)}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-600">{formatINR(b.ceiling)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5", breachActionColor(b.action))}>{b.action}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500">{b.exitDate || "—"}</td>
                                                <td className="px-4 py-3 text-xs text-slate-500 max-w-[180px] truncate">{b.notes || "—"}</td>
                                                <td className="px-4 py-3">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]">
                                                                <MoreHorizontal size={14} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-lg">
                                                            <DropdownMenuItem className="text-xs gap-2" onClick={() => openExit(b)} disabled={b.action === 'Exited'}>
                                                                <LogOut size={12} /> Exit employee
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs gap-2" onClick={() => openBreachEdit(b)}>
                                                                <Edit size={12} /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs gap-2" onClick={() => openBreachView(b)}>
                                                                <Eye size={12} /> View
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* ESI Benefit Claims */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                                            <Shield size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">ESI benefit claims</h3>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Sickness, maternity, medical and dependent benefits tracked under ESIC.</p>
                                        </div>
                                    </div>
                                    <Button
                                        className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs shadow-sm gap-2"
                                        onClick={openNewClaim}
                                    >
                                        <Plus size={14} /> New benefit claim
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: "Total Claims", val: claimStats.total.toString(), icon: ClipboardList, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
                                        { label: "Settled", val: claimStats.settled.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                                        { label: "Total Benefit Amt", val: formatINR(claimStats.totalAmount), icon: IndianRupee, color: "text-blue-500", bg: "bg-blue-50" },
                                        { label: "Avg Claim Amt", val: formatINR(claimStats.avg), icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
                                    ].map((s, i) => (
                                        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 flex items-center gap-3">
                                            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", s.bg, s.color)}>
                                                <s.icon size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{s.label}</p>
                                                <p className="text-sm font-bold text-slate-900 truncate">{s.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <ScrollArea className="max-h-[420px]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr>
                                            {["Employee", "Benefit Type", "Claim Date", "Amount", "Duration", "Status", "Settled", "Actions"].map((h) => (
                                                <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {esiBenefitClaims.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-12 text-center text-xs text-slate-400">
                                                    No benefit claims yet. Click &ldquo;New benefit claim&rdquo; to record one.
                                                </td>
                                            </tr>
                                        ) : esiBenefitClaims.map((c) => {
                                            const Icon = benefitIconMap[c.benefitType] || CircleHelp
                                            return (
                                                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs font-bold text-slate-700">{c.employeeName}</p>
                                                        <p className="text-[10px] text-slate-400">{c.employeeId}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5 gap-1", benefitBadgeColor(c.benefitType))}>
                                                            <Icon size={10} /> {c.benefitType}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-600">{c.claimDate}</td>
                                                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{c.amount != null ? formatINR(c.amount) : "—"}</td>
                                                    <td className="px-4 py-3 text-xs text-slate-600">{c.durationDays != null ? `${c.durationDays} days` : "—"}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5", claimStatusColor(c.status))}>{c.status}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-500">{c.settledDate || "—"}</td>
                                                    <td className="px-4 py-3">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]">
                                                                    <MoreHorizontal size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-lg">
                                                                <DropdownMenuItem className="text-xs gap-2" onClick={() => openEditClaim(c)}>
                                                                    <Edit size={12} /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-xs gap-2" onClick={() => handleMarkSettled(c)} disabled={c.status === 'Settled'}>
                                                                    <CheckCircle2 size={12} /> Mark settled
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-xs gap-2 text-rose-600 focus:text-rose-600" onClick={() => handleClaimDelete(c)}>
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
                </div>
            </div>

            {/* Add/Edit Sheet */}
            <SideFormSheet
                open={isAddOpen}
                onOpenChange={(o) => { setIsAddOpen(o); if (!o) setEditRecord(null) }}
                title={editRecord ? "Edit ESI Record" : "Add ESI Record"}
                description={editRecord ? "Update the ESI contribution details." : "Enter employee details. Contributions auto-calculated (EE: 0.75%, ER: 3.25%)."}
                icon={<Shield size={20} />}
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
                        <Field label="ESIC Number">
                            <Input value={formData.esicNumber} onChange={(e) => setFormData({ ...formData, esicNumber: e.target.value })} />
                        </Field>
                        <Field label="Month">
                            <Input value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Gross Wage (₹)">
                        <Input type="number" value={formData.grossWage} onChange={(e) => setFormData({ ...formData, grossWage: e.target.value })} />
                    </Field>
                    {formData.grossWage && (
                        <>
                            {parseFloat(formData.grossWage) > ESI_WAGE_LIMIT && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-red-500" />
                                    <p className="text-[10px] font-bold text-red-600">Gross wage exceeds ₹21,000 ESI threshold. Employee may not be eligible.</p>
                                </div>
                            )}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto-Calculated Contributions</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div><span className="text-slate-500">Employee (0.75%):</span> <span className="font-bold text-slate-700">₹{Math.round(parseFloat(formData.grossWage) * ESI_EE_RATE)}</span></div>
                                    <div><span className="text-slate-500">Employer (3.25%):</span> <span className="font-bold text-slate-700">₹{Math.round(parseFloat(formData.grossWage) * ESI_ER_RATE)}</span></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SideFormSheet>

            {/* New / Edit Benefit Claim Sheet */}
            <SideFormSheet
                open={isClaimOpen}
                onOpenChange={(o) => { setIsClaimOpen(o); if (!o) setClaimEdit(null) }}
                title={claimEdit ? "Edit benefit claim" : "New benefit claim"}
                description="Record a new ESI benefit claim. All fields except notes are recommended for faster settlement."
                icon={<Heart size={20} />}
                accentColor={claimEdit ? "#7c3aed" : "#4f46e5"}
                width="lg"
                submitLabel={claimEdit ? "Update claim" : "Submit claim"}
                onSubmit={(e) => { e.preventDefault(); handleClaimSave(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee">
                            <Select
                                value={claimForm.employeeId}
                                onValueChange={(val) => {
                                    const emp = uniqueEmployees.find(e => e.employeeId === val)
                                    setClaimForm({ ...claimForm, employeeId: val, employeeName: emp?.employeeName || "" })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueEmployees.map((e) => (
                                        <SelectItem key={e.employeeId} value={e.employeeId} className="text-xs">
                                            {e.employeeName} — {e.esicNumber}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Benefit type">
                            <Select
                                value={claimForm.benefitType}
                                onValueChange={(val) => setClaimForm({ ...claimForm, benefitType: val as ESIBenefitClaim['benefitType'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {(["Sickness", "Maternity", "Disablement", "Dependent", "Medical", "Funeral"] as const).map((t) => (
                                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Claim date">
                            <Input type="date" value={claimForm.claimDate} onChange={(e) => setClaimForm({ ...claimForm, claimDate: e.target.value })} />
                        </Field>
                        <Field label="Amount (₹)">
                            <Input type="number" value={claimForm.amount} onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })} />
                        </Field>
                        <Field label="Duration (days)">
                            <Input type="number" value={claimForm.durationDays} onChange={(e) => setClaimForm({ ...claimForm, durationDays: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Notes">
                        <Textarea value={claimForm.notes} onChange={(e) => setClaimForm({ ...claimForm, notes: e.target.value })} placeholder="Additional context, diagnosis reference, hospital etc." />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Auto-detect Result Dialog */}
            <Dialog open={autoDetectResult !== null && autoDetectResult > 0} onOpenChange={(o) => { if (!o) setAutoDetectResult(null) }}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Auto-detection complete</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Scanned all ESI records against ceiling {formatINR(ceilingInput)}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center justify-center gap-3">
                        <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                            <AlertTriangle size={28} />
                        </div>
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">{autoDetectResult}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            New breach{autoDetectResult === 1 ? '' : 'es'} flagged
                        </p>
                        <p className="text-[11px] text-slate-400 text-center max-w-[300px]">
                            Review each flagged employee in the breaches table. Continue ESI till period end or exit them with an effective date.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white h-9 rounded-lg text-xs font-bold w-full shadow-lg shadow-[#8B5CF6]/20" onClick={() => setAutoDetectResult(null)}>
                            View breaches
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exit Employee from ESI Sheet */}
            <SideFormSheet
                open={isExitOpen}
                onOpenChange={(o) => { setIsExitOpen(o); if (!o) setExitTarget(null) }}
                title="Exit employee from ESI"
                description={exitTarget ? `Record the effective exit date for ${exitTarget.employeeName}. The employee will be marked as exited from ESI scheme.` : undefined}
                icon={<LogOut size={20} />}
                accentColor="#e11d48"
                width="sm"
                submitLabel="Confirm exit"
                onSubmit={(e) => { e.preventDefault(); handleConfirmExit(); }}
            >
                <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2">
                        <UserMinus size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[11px] font-bold text-rose-600">{exitTarget?.employeeName} — {exitTarget?.esicNumber}</p>
                            <p className="text-[10px] text-rose-500 mt-0.5">Breach month: {exitTarget?.breachMonth} · Wage {exitTarget ? formatINR(exitTarget.breachGrossWage) : ""}</p>
                        </div>
                    </div>
                    <Field label="Exit date">
                        <Input type="date" value={exitDate} onChange={(e) => setExitDate(e.target.value)} />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Breach Sheet */}
            <SideFormSheet
                open={isBreachEditOpen}
                onOpenChange={(o) => { setIsBreachEditOpen(o); if (!o) setBreachEdit(null) }}
                title="Edit breach record"
                description="Update the action status and notes for this breach."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save changes"
                onSubmit={(e) => { e.preventDefault(); handleBreachEditSave(); }}
            >
                <div className="space-y-4">
                    <Field label="Action">
                        <Select value={breachEditAction} onValueChange={(v) => setBreachEditAction(v as 'Flagged' | 'Continued' | 'Exited')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Flagged" className="text-xs">Flagged</SelectItem>
                                <SelectItem value="Continued" className="text-xs">Continued</SelectItem>
                                <SelectItem value="Exited" className="text-xs">Exited</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Notes">
                        <Textarea value={breachEditNotes} onChange={(e) => setBreachEditNotes(e.target.value)} />
                    </Field>
                </div>
            </SideFormSheet>

            {/* View Breach Detail Dialog */}
            <Dialog open={isBreachViewOpen} onOpenChange={(o) => { setIsBreachViewOpen(o); if (!o) setBreachView(null) }}>
                <DialogContent className="sm:max-w-[560px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Breach detail</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Full breach information and prior ESI contribution history for this employee.
                        </DialogDescription>
                    </DialogHeader>
                    {breachView && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{breachView.employeeName}</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{breachView.esicNumber}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{breachView.employeeId}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Breach Month</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{breachView.breachMonth}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Breach Wage</p>
                                    <p className="text-xs font-bold text-rose-600 mt-0.5">{formatINR(breachView.breachGrossWage)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ceiling</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{formatINR(breachView.ceiling)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</p>
                                    <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5 mt-1", breachActionColor(breachView.action))}>{breachView.action}</Badge>
                                </div>
                                {breachView.exitDate && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exit Date</p>
                                        <p className="text-xs font-bold text-slate-700 mt-0.5">{breachView.exitDate}</p>
                                    </div>
                                )}
                                {breachView.notes && (
                                    <div className="col-span-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</p>
                                        <p className="text-xs text-slate-600 mt-0.5">{breachView.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Prior ESI Records ({priorRecordsForBreach.length})</p>
                                <div className="rounded-xl border border-slate-100 overflow-hidden">
                                    {priorRecordsForBreach.length === 0 ? (
                                        <p className="p-4 text-xs text-slate-400 text-center">No prior records found for this employee.</p>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    {["Month", "Gross", "EE", "ER", "Status"].map((h) => (
                                                        <th key={h} className="text-[9px] font-bold text-slate-400 px-3 py-2 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {priorRecordsForBreach.map((r) => (
                                                    <tr key={r.id} className="border-t border-slate-50">
                                                        <td className="px-3 py-2 text-[11px] font-bold text-slate-700">{r.month}</td>
                                                        <td className="px-3 py-2 text-[11px] text-slate-600">{formatINR(r.grossWage)}</td>
                                                        <td className="px-3 py-2 text-[11px] text-slate-600">{formatINR(r.esiEmployee)}</td>
                                                        <td className="px-3 py-2 text-[11px] text-slate-600">{formatINR(r.esiEmployer)}</td>
                                                        <td className="px-3 py-2">
                                                            <Badge className={cn("border-none font-semibold text-[9px] px-1.5 py-0.5", statusColor(r.status))}>{r.status}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setIsBreachViewOpen(false); setBreachView(null) }}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ESIManagement
