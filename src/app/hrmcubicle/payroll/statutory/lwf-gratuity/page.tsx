"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Gift,
    ChevronLeft,
    Plus,
    Download,
    Users,
    IndianRupee,
    MapPin,
    Scale,
    Calculator,
    Pencil,
    Trash2,
    Search,
    Filter,
    Info,
    CheckCircle2,
    Clock,
    CalendarDays,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import { useStatutoryStore, LWFRecord, GratuityRecord } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const LWFGratuityPage = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        lwfRecords, addLWFRecord, updateLWFRecord, deleteLWFRecord,
        gratuityRecords, addGratuityRecord, updateGratuityRecord, deleteGratuityRecord,
    } = useStatutoryStore()

    const [activeTab, setActiveTab] = useState("lwf")
    const [lwfSearch, setLwfSearch] = useState("")
    const [gratuitySearch, setGratuitySearch] = useState("")
    const [gratuityStatusFilter, setGratuityStatusFilter] = useState("all")
    const [isLwfAddOpen, setIsLwfAddOpen] = useState(false)
    const [isGratuityAddOpen, setIsGratuityAddOpen] = useState(false)
    const [isCalcOpen, setIsCalcOpen] = useState(false)
    const [editLwf, setEditLwf] = useState<LWFRecord | null>(null)
    const [editGratuity, setEditGratuity] = useState<GratuityRecord | null>(null)

    const [lwfForm, setLwfForm] = useState({ employeeId: "", employeeName: "", state: "Maharashtra", period: "Jan-Jun 2026" })
    const [gratuityForm, setGratuityForm] = useState({ employeeId: "", employeeName: "", dateOfJoining: "", yearsOfService: "", lastDrawnSalary: "" })
    const [calcSalary, setCalcSalary] = useState("")
    const [calcYears, setCalcYears] = useState("")

    const lwfRates: Record<string, { employee: number; employer: number }> = {
        Maharashtra: { employee: 25, employer: 75 },
        Karnataka: { employee: 20, employer: 40 },
        "Tamil Nadu": { employee: 0, employer: 0 },
        "West Bengal": { employee: 6, employer: 18 },
    }

    const statusColor = (s: string) => {
        switch (s) {
            case "Paid": case "Provisioned": return "bg-emerald-50 text-emerald-600"
            case "Filed": case "Eligible": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            case "Not Eligible": return "bg-slate-100 text-slate-400"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    // LWF
    const filteredLwf = useMemo(() => {
        return lwfRecords.filter((r) => r.employeeName.toLowerCase().includes(lwfSearch.toLowerCase()) || r.employeeId.toLowerCase().includes(lwfSearch.toLowerCase()))
    }, [lwfRecords, lwfSearch])

    const lwfStats = useMemo(() => {
        const totalEE = lwfRecords.reduce((s, r) => s + r.employeeContribution, 0)
        const totalER = lwfRecords.reduce((s, r) => s + r.employerContribution, 0)
        const filed = lwfRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const stateCount = new Set(lwfRecords.map((r) => r.state)).size
        return { totalEE, totalER, total: totalEE + totalER, filed, stateCount, count: lwfRecords.length }
    }, [lwfRecords])

    const lwfFilingTracker = [
        { state: "Maharashtra", period: "Jul-Dec 2025", status: "Paid", amount: "₹200", dueDate: "15 Jan 2026" },
        { state: "Maharashtra", period: "Jan-Jun 2026", status: "Pending", amount: "₹200", dueDate: "15 Jul 2026" },
        { state: "Karnataka", period: "Jan-Jun 2026", status: "Pending", amount: "₹120", dueDate: "15 Jul 2026" },
    ]

    const handleLwfSave = () => {
        const rates = lwfRates[lwfForm.state] || { employee: 0, employer: 0 }
        if (editLwf) {
            updateLWFRecord(editLwf.id, {
                employeeName: lwfForm.employeeName,
                state: lwfForm.state,
                employeeContribution: rates.employee,
                employerContribution: rates.employer,
                period: lwfForm.period,
            })
            toast({ title: "Updated", description: `LWF record for ${lwfForm.employeeName} updated.` })
        } else {
            addLWFRecord({
                id: `lwf-${Date.now()}`,
                employeeId: lwfForm.employeeId,
                employeeName: lwfForm.employeeName,
                state: lwfForm.state,
                employeeContribution: rates.employee,
                employerContribution: rates.employer,
                period: lwfForm.period,
                status: "Pending",
            })
            toast({ title: "Added", description: `LWF record for ${lwfForm.employeeName} created.` })
        }
        setIsLwfAddOpen(false)
        setEditLwf(null)
        setLwfForm({ employeeId: "", employeeName: "", state: "Maharashtra", period: "Jan-Jun 2026" })
    }

    // Gratuity
    const filteredGratuity = useMemo(() => {
        return gratuityRecords.filter((r) => {
            const matchSearch = r.employeeName.toLowerCase().includes(gratuitySearch.toLowerCase()) || r.employeeId.toLowerCase().includes(gratuitySearch.toLowerCase())
            const matchStatus = gratuityStatusFilter === "all" || r.status === gratuityStatusFilter
            return matchSearch && matchStatus
        })
    }, [gratuityRecords, gratuitySearch, gratuityStatusFilter])

    const gratuityStats = useMemo(() => {
        const eligible = gratuityRecords.filter((r) => r.yearsOfService >= 5).length
        const provisioned = gratuityRecords.filter((r) => r.status === "Provisioned" || r.status === "Paid").reduce((s, r) => s + r.gratuityAmount, 0)
        const totalLiability = gratuityRecords.filter((r) => r.yearsOfService >= 5).reduce((s, r) => s + (r.gratuityAmount || calculateGratuity(r.lastDrawnSalary, r.yearsOfService)), 0)
        return { eligible, total: gratuityRecords.length, provisioned, totalLiability }
    }, [gratuityRecords])

    function calculateGratuity(salary: number, years: number): number {
        if (years < 5) return 0
        return Math.round((15 * salary * years) / 26)
    }

    const handleGratuitySave = () => {
        const years = parseFloat(gratuityForm.yearsOfService) || 0
        const salary = parseFloat(gratuityForm.lastDrawnSalary) || 0
        const amount = calculateGratuity(salary, years)
        const status = years >= 5 ? "Eligible" : "Not Eligible"

        if (editGratuity) {
            updateGratuityRecord(editGratuity.id, {
                employeeName: gratuityForm.employeeName,
                dateOfJoining: gratuityForm.dateOfJoining,
                yearsOfService: years,
                lastDrawnSalary: salary,
                gratuityAmount: amount,
                status: editGratuity.status === "Provisioned" || editGratuity.status === "Paid" ? editGratuity.status : status,
            })
            toast({ title: "Updated", description: `Gratuity record for ${gratuityForm.employeeName} updated.` })
        } else {
            addGratuityRecord({
                id: `gr-${Date.now()}`,
                employeeId: gratuityForm.employeeId,
                employeeName: gratuityForm.employeeName,
                dateOfJoining: gratuityForm.dateOfJoining,
                yearsOfService: years,
                lastDrawnSalary: salary,
                gratuityAmount: amount,
                status,
            })
            toast({ title: "Added", description: `Gratuity record for ${gratuityForm.employeeName} created.` })
        }
        setIsGratuityAddOpen(false)
        setEditGratuity(null)
        setGratuityForm({ employeeId: "", employeeName: "", dateOfJoining: "", yearsOfService: "", lastDrawnSalary: "" })
    }

    const handleExport = (type: string) => {
        let csv = ""
        if (type === "lwf") {
            csv = ["Employee ID,Employee Name,State,Employee Contribution,Employer Contribution,Period,Status", ...lwfRecords.map((r) => `${r.employeeId},${r.employeeName},${r.state},${r.employeeContribution},${r.employerContribution},${r.period},${r.status}`)].join("\n")
        } else {
            csv = ["Employee ID,Employee Name,DOJ,Years of Service,Last Drawn Salary,Gratuity Amount,Status", ...gratuityRecords.map((r) => `${r.employeeId},${r.employeeName},${r.dateOfJoining},${r.yearsOfService},${r.lastDrawnSalary},${r.gratuityAmount},${r.status}`)].join("\n")
        }
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${type}_report_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${type.toUpperCase()} report downloaded.` })
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => router.push("/hrmcubicle/payroll/statutory")}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                        <Gift size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">LWF & Gratuity</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">Labour Welfare Fund & Gratuity Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={() => handleExport(activeTab === "lwf" ? "lwf" : "gratuity")}>
                        <Download size={14} /> Export
                    </Button>
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={() => setIsCalcOpen(true)}>
                        <Calculator size={14} /> Gratuity Calculator
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-6 pb-32">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-white border border-slate-200 rounded-xl p-1 h-auto">
                            <TabsTrigger value="lwf" className="rounded-lg text-xs font-bold px-6 py-2.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
                                <Scale size={14} className="mr-2" /> Labour Welfare Fund
                            </TabsTrigger>
                            <TabsTrigger value="gratuity" className="rounded-lg text-xs font-bold px-6 py-2.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
                                <Gift size={14} className="mr-2" /> Gratuity
                            </TabsTrigger>
                        </TabsList>

                        {/* LWF Tab */}
                        <TabsContent value="lwf" className="mt-6 space-y-6">
                            {/* LWF Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: "Total LWF Contribution", val: `₹${lwfStats.total}`, icon: IndianRupee, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: `EE: ₹${lwfStats.totalEE} + ER: ₹${lwfStats.totalER}` },
                                    { label: "States Covered", val: lwfStats.stateCount.toString(), icon: MapPin, color: "text-blue-500", bg: "bg-blue-50", trend: "Active" },
                                    { label: "Employees", val: lwfStats.count.toString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50", trend: "Enrolled" },
                                    { label: "Filed", val: `${lwfStats.count > 0 ? Math.round((lwfStats.filed / lwfStats.count) * 100) : 0}%`, icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-50", trend: `${lwfStats.filed}/${lwfStats.count}` },
                                ].map((stat, i) => (
                                    <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                                    <stat.icon size={20} />
                                                </div>
                                                <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-slate-50">{stat.trend}</Badge>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* State-wise rates info */}
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                                <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-blue-700">LWF Contribution Rates (Half-Yearly)</p>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {Object.entries(lwfRates).map(([state, rates]) => (
                                            <div key={state} className="text-[10px] text-blue-600">
                                                <span className="font-bold">{state}:</span> EE ₹{rates.employee} + ER ₹{rates.employer}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* LWF Filters & Table */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="Search employees..." className="pl-9 h-10 rounded-lg border-slate-200 text-xs" value={lwfSearch} onChange={(e) => setLwfSearch(e.target.value)} />
                                </div>
                                <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={() => { setEditLwf(null); setLwfForm({ employeeId: "", employeeName: "", state: "Maharashtra", period: "Jan-Jun 2026" }); setIsLwfAddOpen(true) }}>
                                    <Plus size={14} /> Add Record
                                </Button>
                            </div>

                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-900">LWF Contributions</h3>
                                    </div>
                                    <ScrollArea className="max-h-[350px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50 z-10">
                                                <tr>
                                                    {["Employee", "State", "Employee (₹)", "Employer (₹)", "Period", "Status", "Actions"].map((h) => (
                                                        <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredLwf.map((r) => (
                                                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                        <td className="px-4 py-3">
                                                            <p className="text-xs font-bold text-slate-700">{r.employeeName}</p>
                                                            <p className="text-[10px] text-slate-400">{r.employeeId}</p>
                                                        </td>
                                                        <td className="px-4 py-3"><Badge variant="outline" className="font-bold text-[9px] text-slate-500 border-slate-200">{r.state}</Badge></td>
                                                        <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.employeeContribution}</td>
                                                        <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.employerContribution}</td>
                                                        <td className="px-4 py-3 text-xs text-slate-500">{r.period}</td>
                                                        <td className="px-4 py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.status))}>{r.status}</Badge></td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => { setEditLwf(r); setLwfForm({ employeeId: r.employeeId, employeeName: r.employeeName, state: r.state, period: r.period }); setIsLwfAddOpen(true) }}>
                                                                    <Pencil size={12} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500" onClick={() => { deleteLWFRecord(r.id); toast({ title: "Deleted", description: `LWF record removed.` }) }}>
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

                            {/* LWF Filing Tracker */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-900">Half-Yearly Filing Tracker</h3>
                                    </div>
                                    <div className="p-4">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    {["State", "Period", "Amount", "Due Date", "Status"].map((h) => (
                                                        <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lwfFilingTracker.map((row, i) => (
                                                    <tr key={i} className="border-b border-slate-50 last:border-none">
                                                        <td className="py-3 text-xs font-bold text-slate-700">{row.state}</td>
                                                        <td className="py-3 text-xs text-slate-600">{row.period}</td>
                                                        <td className="py-3 text-xs font-bold text-slate-700">{row.amount}</td>
                                                        <td className="py-3 text-xs text-slate-500">{row.dueDate}</td>
                                                        <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(row.status))}>{row.status}</Badge></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Gratuity Tab */}
                        <TabsContent value="gratuity" className="mt-6 space-y-6">
                            {/* Gratuity Formula */}
                            <div className="p-5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/5 to-purple-50 border border-[#8B5CF6]/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator size={16} className="text-[#8B5CF6]" />
                                    <p className="text-xs font-bold text-[#8B5CF6]">Gratuity Formula (Payment of Gratuity Act, 1972)</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-[#8B5CF6]/10 inline-block">
                                    <p className="text-sm font-bold text-slate-800 font-mono">Gratuity = (15 x Last Drawn Salary x Years of Service) / 26</p>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">Applicable to employees who have completed 5 or more years of continuous service. Maximum gratuity payable: ₹25,00,000 (w.e.f. 29 March 2018).</p>
                            </div>

                            {/* Gratuity Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: "Eligible Employees", val: gratuityStats.eligible.toString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50", trend: `of ${gratuityStats.total} total` },
                                    { label: "Provisioned Amount", val: `₹${(gratuityStats.provisioned / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: "Booked" },
                                    { label: "Total Liability", val: `₹${(gratuityStats.totalLiability / 100000).toFixed(1)}L`, icon: Scale, color: "text-amber-500", bg: "bg-amber-50", trend: "All eligible" },
                                    { label: "Avg Service Years", val: `${gratuityRecords.length > 0 ? (gratuityRecords.reduce((s, r) => s + r.yearsOfService, 0) / gratuityRecords.length).toFixed(1) : 0} yrs`, icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-50", trend: "Across all" },
                                ].map((stat, i) => (
                                    <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                                    <stat.icon size={20} />
                                                </div>
                                                <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-slate-50">{stat.trend}</Badge>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Gratuity Filters */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="Search employees..." className="pl-9 h-10 rounded-lg border-slate-200 text-xs" value={gratuitySearch} onChange={(e) => setGratuitySearch(e.target.value)} />
                                </div>
                                <Select value={gratuityStatusFilter} onValueChange={setGratuityStatusFilter}>
                                    <SelectTrigger className="w-[160px] h-10 rounded-lg border-slate-200 text-xs font-medium">
                                        <Filter size={12} className="mr-1.5" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Eligible">Eligible</SelectItem>
                                        <SelectItem value="Provisioned">Provisioned</SelectItem>
                                        <SelectItem value="Not Eligible">Not Eligible</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={() => { setEditGratuity(null); setGratuityForm({ employeeId: "", employeeName: "", dateOfJoining: "", yearsOfService: "", lastDrawnSalary: "" }); setIsGratuityAddOpen(true) }}>
                                    <Plus size={14} /> Add Record
                                </Button>
                            </div>

                            {/* Gratuity Table */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900">Gratuity Provisioning Table</h3>
                                        <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{filteredGratuity.length} records</Badge>
                                    </div>
                                    <ScrollArea className="max-h-[400px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50 z-10">
                                                <tr>
                                                    {["Employee", "Date of Joining", "Service (Yrs)", "Last Drawn Salary", "Gratuity Amount", "Status", "Actions"].map((h) => (
                                                        <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredGratuity.map((r) => (
                                                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                        <td className="px-4 py-3">
                                                            <p className="text-xs font-bold text-slate-700">{r.employeeName}</p>
                                                            <p className="text-[10px] text-slate-400">{r.employeeId}</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-slate-600">{r.dateOfJoining}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={cn("text-xs font-bold", r.yearsOfService >= 5 ? "text-emerald-600" : "text-slate-400")}>{r.yearsOfService}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{r.lastDrawnSalary.toLocaleString("en-IN")}</td>
                                                        <td className="px-4 py-3 text-xs font-bold text-[#8B5CF6]">{r.gratuityAmount > 0 ? `₹${r.gratuityAmount.toLocaleString("en-IN")}` : "-"}</td>
                                                        <td className="px-4 py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.status))}>{r.status}</Badge></td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => { setEditGratuity(r); setGratuityForm({ employeeId: r.employeeId, employeeName: r.employeeName, dateOfJoining: r.dateOfJoining, yearsOfService: r.yearsOfService.toString(), lastDrawnSalary: r.lastDrawnSalary.toString() }); setIsGratuityAddOpen(true) }}>
                                                                    <Pencil size={12} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500" onClick={() => { deleteGratuityRecord(r.id); toast({ title: "Deleted", description: `Gratuity record removed.` }) }}>
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
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* LWF Add/Edit Dialog */}
            <Dialog open={isLwfAddOpen} onOpenChange={(o) => { setIsLwfAddOpen(o); if (!o) setEditLwf(null) }}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editLwf ? "Edit LWF Record" : "Add LWF Record"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Contributions are based on state rates.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee ID</Label>
                                <Input className="h-9 text-xs rounded-lg" value={lwfForm.employeeId} onChange={(e) => setLwfForm({ ...lwfForm, employeeId: e.target.value })} disabled={!!editLwf} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee Name</Label>
                                <Input className="h-9 text-xs rounded-lg" value={lwfForm.employeeName} onChange={(e) => setLwfForm({ ...lwfForm, employeeName: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">State</Label>
                                <Select value={lwfForm.state} onValueChange={(v) => setLwfForm({ ...lwfForm, state: v })}>
                                    <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(lwfRates).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Period</Label>
                                <Input className="h-9 text-xs rounded-lg" value={lwfForm.period} onChange={(e) => setLwfForm({ ...lwfForm, period: e.target.value })} />
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contribution Preview</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-slate-500">Employee:</span> <span className="font-bold text-slate-700">₹{lwfRates[lwfForm.state]?.employee || 0}</span></div>
                                <div><span className="text-slate-500">Employer:</span> <span className="font-bold text-slate-700">₹{lwfRates[lwfForm.state]?.employer || 0}</span></div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setIsLwfAddOpen(false); setEditLwf(null) }}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white h-9 rounded-lg text-xs font-bold shadow-lg shadow-[#8B5CF6]/20" onClick={handleLwfSave}>{editLwf ? "Update" : "Add"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Gratuity Add/Edit Dialog */}
            <Dialog open={isGratuityAddOpen} onOpenChange={(o) => { setIsGratuityAddOpen(o); if (!o) setEditGratuity(null) }}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editGratuity ? "Edit Gratuity Record" : "Add Gratuity Record"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Gratuity auto-calculated: (15 x salary x years) / 26</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee ID</Label>
                                <Input className="h-9 text-xs rounded-lg" value={gratuityForm.employeeId} onChange={(e) => setGratuityForm({ ...gratuityForm, employeeId: e.target.value })} disabled={!!editGratuity} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee Name</Label>
                                <Input className="h-9 text-xs rounded-lg" value={gratuityForm.employeeName} onChange={(e) => setGratuityForm({ ...gratuityForm, employeeName: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Date of Joining</Label>
                            <Input className="h-9 text-xs rounded-lg" type="date" value={gratuityForm.dateOfJoining} onChange={(e) => setGratuityForm({ ...gratuityForm, dateOfJoining: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Years of Service</Label>
                                <Input className="h-9 text-xs rounded-lg" type="number" value={gratuityForm.yearsOfService} onChange={(e) => setGratuityForm({ ...gratuityForm, yearsOfService: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Last Drawn Salary (₹)</Label>
                                <Input className="h-9 text-xs rounded-lg" type="number" value={gratuityForm.lastDrawnSalary} onChange={(e) => setGratuityForm({ ...gratuityForm, lastDrawnSalary: e.target.value })} />
                            </div>
                        </div>
                        {gratuityForm.yearsOfService && gratuityForm.lastDrawnSalary && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculated Gratuity</p>
                                <p className="text-lg font-bold text-[#8B5CF6]">
                                    ₹{calculateGratuity(parseFloat(gratuityForm.lastDrawnSalary), parseFloat(gratuityForm.yearsOfService)).toLocaleString("en-IN")}
                                </p>
                                {parseFloat(gratuityForm.yearsOfService) < 5 && (
                                    <p className="text-[10px] text-red-500 font-medium mt-1">Not eligible (less than 5 years of service)</p>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setIsGratuityAddOpen(false); setEditGratuity(null) }}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white h-9 rounded-lg text-xs font-bold shadow-lg shadow-[#8B5CF6]/20" onClick={handleGratuitySave}>{editGratuity ? "Update" : "Add"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Gratuity Calculator Dialog */}
            <Dialog open={isCalcOpen} onOpenChange={setIsCalcOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Gratuity Calculator</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Quick calculation using the statutory formula</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Last Drawn Salary (₹)</Label>
                            <Input className="h-9 text-xs rounded-lg" type="number" value={calcSalary} onChange={(e) => setCalcSalary(e.target.value)} placeholder="e.g. 65000" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Years of Service</Label>
                            <Input className="h-9 text-xs rounded-lg" type="number" value={calcYears} onChange={(e) => setCalcYears(e.target.value)} placeholder="e.g. 8" />
                        </div>
                        {calcSalary && calcYears && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[#8B5CF6]/5 to-purple-50 border border-[#8B5CF6]/10 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Gratuity</p>
                                <p className="text-3xl font-bold text-[#8B5CF6]">₹{calculateGratuity(parseFloat(calcSalary), parseFloat(calcYears)).toLocaleString("en-IN")}</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-mono">(15 x {calcSalary} x {calcYears}) / 26</p>
                                {parseFloat(calcYears) < 5 && <p className="text-[10px] text-red-500 font-bold mt-2">Not eligible - minimum 5 years required</p>}
                                {calculateGratuity(parseFloat(calcSalary), parseFloat(calcYears)) > 2500000 && <p className="text-[10px] text-amber-600 font-bold mt-2">Exceeds statutory maximum of ₹25,00,000</p>}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => { setIsCalcOpen(false); setCalcSalary(""); setCalcYears("") }}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LWFGratuityPage
