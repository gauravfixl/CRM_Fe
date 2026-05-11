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
    TrendingUp,
    Building2,
    LineChart,
    History,
    PiggyBank,
    Edit,
    MoreHorizontal,
    Landmark,
    ShieldCheck,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    useStatutoryStore,
    LWFRecord,
    GratuityRecord,
    GratuityProvision,
    StateLwfConfig,
} from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const formatINR = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

const LWFGratuityPage = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        lwfRecords, addLWFRecord, updateLWFRecord, deleteLWFRecord,
        gratuityRecords, addGratuityRecord, updateGratuityRecord, deleteGratuityRecord,
        gratuityProvisions, addGratuityProvision, updateGratuityProvision, deleteGratuityProvision,
        computeGratuityLiability,
        stateLwfConfigs, updateStateLwfConfig,
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

    // ── Round 2: Actuarial Valuation ──────────────────────────────────────────
    const [discountRate, setDiscountRate] = useState(7.2)
    const [salaryGrowthRate, setSalaryGrowthRate] = useState(8.5)
    const [attritionRate, setAttritionRate] = useState(12.0)
    const [actuarialResult, setActuarialResult] = useState<{ totalLiability: number; currentServiceCost: number; eligibleCount: number } | null>(null)

    // Provision dialogs
    const [isProvisionOpen, setIsProvisionOpen] = useState(false)
    const [editProvision, setEditProvision] = useState<GratuityProvision | null>(null)
    const [deleteProvisionId, setDeleteProvisionId] = useState<string | null>(null)
    const [provisionForm, setProvisionForm] = useState({
        month: "",
        totalLiability: "",
        currentServiceCost: "",
        interestCost: "",
        actuarialGainLoss: "",
        fundedAmount: "",
        eligibleEmployeeCount: "",
        discountRate: "7.2",
        salaryGrowthRate: "8.5",
        attritionRate: "12.0",
        recordedBy: "Finance Lead",
    })

    // State LWF Config edit dialog
    const [isStateCfgOpen, setIsStateCfgOpen] = useState(false)
    const [editStateCfg, setEditStateCfg] = useState<StateLwfConfig | null>(null)
    const [stateCfgForm, setStateCfgForm] = useState({
        employeeContribution: "",
        employerContribution: "",
        frequency: "Half-Yearly" as StateLwfConfig['frequency'],
        dueDate: "",
        applicable: true,
        notes: "",
    })

    const monthLabel = useMemo(() => {
        const d = new Date()
        return d.toLocaleString("en-US", { month: "short", year: "numeric" })
    }, [])

    const openProvisionDialog = (pref?: GratuityProvision) => {
        if (pref) {
            setEditProvision(pref)
            setProvisionForm({
                month: pref.month,
                totalLiability: String(pref.totalLiability),
                currentServiceCost: String(pref.currentServiceCost),
                interestCost: String(pref.interestCost),
                actuarialGainLoss: String(pref.actuarialGainLoss),
                fundedAmount: String(pref.fundedAmount || 0),
                eligibleEmployeeCount: String(pref.eligibleEmployeeCount),
                discountRate: String(pref.discountRate),
                salaryGrowthRate: String(pref.salaryGrowthRate),
                attritionRate: String(pref.attritionRate),
                recordedBy: pref.recordedBy,
            })
        } else {
            setEditProvision(null)
            const computed = actuarialResult || computeGratuityLiability(discountRate, salaryGrowthRate, attritionRate)
            const prevLiab = gratuityProvisions[0]?.totalLiability || 0
            setProvisionForm({
                month: monthLabel,
                totalLiability: String(Math.round(computed.totalLiability)),
                currentServiceCost: String(Math.round(computed.currentServiceCost)),
                interestCost: String(Math.round((prevLiab * discountRate) / 100 / 12)),
                actuarialGainLoss: "0",
                fundedAmount: String(gratuityProvisions[0]?.fundedAmount || 0),
                eligibleEmployeeCount: String(computed.eligibleCount),
                discountRate: String(discountRate),
                salaryGrowthRate: String(salaryGrowthRate),
                attritionRate: String(attritionRate),
                recordedBy: "Finance Lead",
            })
        }
        setIsProvisionOpen(true)
    }

    const handleProvisionSave = () => {
        const totalLiab = parseFloat(provisionForm.totalLiability) || 0
        const funded = parseFloat(provisionForm.fundedAmount) || 0
        const payload: Omit<GratuityProvision, 'id'> = {
            month: provisionForm.month,
            totalLiability: totalLiab,
            currentServiceCost: parseFloat(provisionForm.currentServiceCost) || 0,
            interestCost: parseFloat(provisionForm.interestCost) || 0,
            actuarialGainLoss: parseFloat(provisionForm.actuarialGainLoss) || 0,
            fundedAmount: funded,
            unfundedLiability: Math.max(totalLiab - funded, 0),
            eligibleEmployeeCount: parseInt(provisionForm.eligibleEmployeeCount) || 0,
            discountRate: parseFloat(provisionForm.discountRate) || 0,
            salaryGrowthRate: parseFloat(provisionForm.salaryGrowthRate) || 0,
            attritionRate: parseFloat(provisionForm.attritionRate) || 0,
            recordedBy: provisionForm.recordedBy,
            recordedDate: new Date().toISOString().split("T")[0],
        }
        if (editProvision) {
            updateGratuityProvision(editProvision.id, payload)
            toast({ title: "Updated", description: `Provision for ${payload.month} updated.` })
        } else {
            addGratuityProvision(payload)
            toast({ title: "Recorded", description: `Provision for ${payload.month} saved.` })
        }
        setIsProvisionOpen(false)
        setEditProvision(null)
    }

    const handleProvisionDelete = () => {
        if (!deleteProvisionId) return
        deleteGratuityProvision(deleteProvisionId)
        toast({ title: "Deleted", description: "Provision removed." })
        setDeleteProvisionId(null)
    }

    const openStateCfg = (cfg: StateLwfConfig) => {
        setEditStateCfg(cfg)
        setStateCfgForm({
            employeeContribution: String(cfg.employeeContribution),
            employerContribution: String(cfg.employerContribution),
            frequency: cfg.frequency,
            dueDate: cfg.dueDate,
            applicable: cfg.applicable,
            notes: cfg.notes || "",
        })
        setIsStateCfgOpen(true)
    }

    const handleStateCfgSave = () => {
        if (!editStateCfg) return
        updateStateLwfConfig(editStateCfg.state, {
            employeeContribution: parseFloat(stateCfgForm.employeeContribution) || 0,
            employerContribution: parseFloat(stateCfgForm.employerContribution) || 0,
            frequency: stateCfgForm.frequency,
            dueDate: stateCfgForm.dueDate,
            applicable: stateCfgForm.applicable,
            notes: stateCfgForm.notes,
        })
        toast({ title: "Updated", description: `${editStateCfg.state} LWF config updated.` })
        setIsStateCfgOpen(false)
        setEditStateCfg(null)
    }

    // Provision trend chart data
    const provisionTrend = useMemo(() => {
        const sorted = [...gratuityProvisions].reverse() // oldest -> newest
        const values = sorted.map(p => p.totalLiability)
        const maxV = Math.max(...values, 1)
        const minV = Math.min(...values, 0)
        const range = maxV - minV || 1
        const width = 560
        const height = 120
        const padX = 10
        const padY = 12
        const stepX = values.length > 1 ? (width - padX * 2) / (values.length - 1) : 0
        const points = values.map((v, i) => {
            const x = padX + i * stepX
            const y = padY + (height - padY * 2) * (1 - (v - minV) / range)
            return { x, y, v, label: sorted[i]?.month }
        })
        const poly = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
        return { points, poly, width, height, maxV, minV }
    }, [gratuityProvisions])

    // Latest provision for trust fund
    const latestProvision = gratuityProvisions[0] || null
    const fundedPct = latestProvision && latestProvision.totalLiability > 0
        ? Math.min(100, Math.round(((latestProvision.fundedAmount || 0) / latestProvision.totalLiability) * 100))
        : 0

    // State-wise LWF employer contribution totals
    const stateContribTotals = useMemo(() => {
        const totals: Record<string, number> = {}
        lwfRecords.forEach(r => {
            totals[r.state] = (totals[r.state] || 0) + r.employerContribution
        })
        const entries = Object.entries(totals).sort((a, b) => b[1] - a[1])
        const max = Math.max(...entries.map(e => e[1]), 1)
        return { entries, max }
    }, [lwfRecords])

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

                            {/* Round 2: State-wise LWF Configuration */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Landmark size={16} className="text-[#8B5CF6]" />
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">State-wise LWF configuration</h3>
                                                <p className="text-[10px] text-slate-500 mt-0.5">Contribution rates & filing frequencies</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{stateLwfConfigs.filter(c => c.applicable).length} / {stateLwfConfigs.length} active</Badge>
                                    </div>
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {stateLwfConfigs.map((cfg) => (
                                            <div key={cfg.state} className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all", !cfg.applicable && "opacity-50 bg-slate-50")}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{cfg.state}</p>
                                                        <Badge className={cn("mt-1 border-none font-bold text-[9px] px-2 py-0.5",
                                                            cfg.frequency === "Monthly" ? "bg-blue-50 text-blue-600" :
                                                                cfg.frequency === "Half-Yearly" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                                    "bg-amber-50 text-amber-600")}>{cfg.frequency}</Badge>
                                                    </div>
                                                    <Switch checked={cfg.applicable} onCheckedChange={(v) => { updateStateLwfConfig(cfg.state, { applicable: v }); toast({ title: v ? "Enabled" : "Disabled", description: `${cfg.state} ${v ? "enabled" : "disabled"}.` }) }} />
                                                </div>
                                                <div className="space-y-1.5 mb-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Employee</span>
                                                        <span className="text-xs font-bold text-slate-700 tabular-nums">{cfg.notes?.includes("%") ? `${cfg.employeeContribution}%` : `₹${cfg.employeeContribution}`}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Employer</span>
                                                        <span className="text-xs font-bold text-slate-700 tabular-nums">{cfg.notes?.includes("%") ? `${cfg.employerContribution}%` : `₹${cfg.employerContribution}`}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        <CalendarDays size={11} className="text-slate-400" />
                                                        <span className="text-[10px] text-slate-500">{cfg.dueDate}</span>
                                                    </div>
                                                </div>
                                                {cfg.notes && <p className="text-[10px] italic text-slate-400 mb-2">{cfg.notes}</p>}
                                                <Button variant="outline" className="h-7 w-full rounded-lg text-[10px] font-bold text-slate-600 border-slate-200 gap-1.5" onClick={() => openStateCfg(cfg)}>
                                                    <Edit size={11} /> Edit
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Round 2: LWF State Comparison Chart */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                                        <LineChart size={16} className="text-[#8B5CF6]" />
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">Employer contribution by state</h3>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Total employer LWF contribution across enrolled employees</p>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        {stateContribTotals.entries.length === 0 && (
                                            <p className="text-xs text-slate-400 italic">No contributions recorded yet.</p>
                                        )}
                                        {stateContribTotals.entries.map(([state, total]) => (
                                            <div key={state} className="flex items-center gap-3">
                                                <div className="w-28 flex-shrink-0">
                                                    <p className="text-[11px] font-bold text-slate-700">{state}</p>
                                                </div>
                                                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-indigo-500 rounded-full transition-all flex items-center justify-end pr-2" style={{ width: `${(total / stateContribTotals.max) * 100}%` }}>
                                                        <span className="text-[9px] font-bold text-white tabular-nums">{formatINR(total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Gratuity Tab */}
                        <TabsContent value="gratuity" className="mt-6 space-y-6">
                            {/* Gratuity Formula + Trust Fund mini-card */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 p-5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/5 to-purple-50 border border-[#8B5CF6]/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calculator size={16} className="text-[#8B5CF6]" />
                                        <p className="text-xs font-bold text-[#8B5CF6]">Gratuity Formula (Payment of Gratuity Act, 1972)</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-[#8B5CF6]/10 inline-block">
                                        <p className="text-sm font-bold text-slate-800 font-mono">Gratuity = (15 x Last Drawn Salary x Years of Service) / 26</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">Applicable to employees who have completed 5 or more years of continuous service. Maximum gratuity payable: ₹25,00,000 (w.e.f. 29 March 2018).</p>
                                </div>

                                {/* Trust Fund mini-card */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                                    <PiggyBank size={16} />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trust Fund</p>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px]">{latestProvision?.month || "—"}</Badge>
                                        </div>
                                        {latestProvision ? (
                                            <>
                                                <div className="flex items-baseline justify-between">
                                                    <p className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(latestProvision.fundedAmount || 0)}</p>
                                                    <p className="text-[10px] text-slate-500">/ {formatINR(latestProvision.totalLiability)}</p>
                                                </div>
                                                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${fundedPct}%` }} />
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-[10px] font-bold text-emerald-600 tabular-nums">{fundedPct}% Funded</p>
                                                    <p className={cn("text-[10px] font-bold tabular-nums", latestProvision.unfundedLiability > 0 ? "text-rose-500" : "text-slate-400")}>
                                                        Unfunded: {formatINR(latestProvision.unfundedLiability)}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No provisions recorded yet.</p>
                                        )}
                                    </CardContent>
                                </Card>
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

                            {/* Round 2: Actuarial Valuation */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-[#8B5CF6]" />
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Actuarial valuation</h3>
                                                <p className="text-[10px] text-slate-500 mt-0.5">Compute present value of gratuity obligation (PVGD)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount rate %</Label>
                                                <Input type="number" step={0.1} min={5} max={12} className="h-9 text-xs rounded-lg tabular-nums" value={discountRate} onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)} />
                                                <p className="text-[10px] text-slate-400">Range 5-12% (G-Sec yield based)</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salary growth rate %</Label>
                                                <Input type="number" step={0.1} min={0} max={20} className="h-9 text-xs rounded-lg tabular-nums" value={salaryGrowthRate} onChange={(e) => setSalaryGrowthRate(parseFloat(e.target.value) || 0)} />
                                                <p className="text-[10px] text-slate-400">Expected annual escalation</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attrition rate %</Label>
                                                <Input type="number" step={0.1} min={0} max={40} className="h-9 text-xs rounded-lg tabular-nums" value={attritionRate} onChange={(e) => setAttritionRate(parseFloat(e.target.value) || 0)} />
                                                <p className="text-[10px] text-slate-400">Expected withdrawal rate</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-5 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 gap-2" onClick={() => {
                                                const r = computeGratuityLiability(discountRate, salaryGrowthRate, attritionRate)
                                                setActuarialResult(r)
                                                toast({ title: "Computed", description: `PVGD = ${formatINR(r.totalLiability)}` })
                                            }}>
                                                <Calculator size={13} /> Compute
                                            </Button>
                                            <Button variant="outline" disabled={!actuarialResult} className="rounded-lg h-9 px-5 font-bold text-xs gap-2 border-slate-200" onClick={() => openProvisionDialog()}>
                                                <Plus size={13} /> Record provision
                                            </Button>
                                        </div>

                                        {actuarialResult && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                                <div className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Scale size={14} className="text-[#8B5CF6]" />
                                                        <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">Total liability (PVGD)</p>
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(actuarialResult.totalLiability)}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">Present value obligation</p>
                                                </div>
                                                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <TrendingUp size={14} className="text-blue-500" />
                                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Current service cost / month</p>
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(actuarialResult.currentServiceCost)}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">Monthly provision expense</p>
                                                </div>
                                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Users size={14} className="text-emerald-500" />
                                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Eligible employees</p>
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-900 tabular-nums">{actuarialResult.eligibleCount}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">With 5+ years of service</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Round 2: Monthly Provision History */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <History size={16} className="text-[#8B5CF6]" />
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Monthly provision history</h3>
                                                <p className="text-[10px] text-slate-500 mt-0.5">Actuarial provisions recorded per month</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{gratuityProvisions.length} records</Badge>
                                    </div>
                                    <ScrollArea className="max-h-[360px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50 z-10">
                                                <tr>
                                                    {["Month", "Total liability", "Current service cost", "Interest cost", "Actuarial G/L", "Funded", "Unfunded", "Recorded by", "Actions"].map((h) => (
                                                        <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gratuityProvisions.length === 0 && (
                                                    <tr><td colSpan={9} className="px-4 py-8 text-center text-xs text-slate-400 italic">No provisions recorded yet. Use the Actuarial valuation above to compute and record.</td></tr>
                                                )}
                                                {gratuityProvisions.map((p) => (
                                                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                        <td className="px-4 py-3"><p className="text-xs font-bold text-slate-700">{p.month}</p></td>
                                                        <td className="px-4 py-3 text-xs font-bold text-[#8B5CF6] tabular-nums">{formatINR(p.totalLiability)}</td>
                                                        <td className="px-4 py-3 text-xs text-slate-600 tabular-nums">{formatINR(p.currentServiceCost)}</td>
                                                        <td className="px-4 py-3 text-xs text-slate-600 tabular-nums">{formatINR(p.interestCost)}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={cn("text-xs font-bold tabular-nums", p.actuarialGainLoss < 0 ? "text-rose-500" : p.actuarialGainLoss > 0 ? "text-emerald-500" : "text-slate-500")}>
                                                                {p.actuarialGainLoss < 0 ? "−" : p.actuarialGainLoss > 0 ? "+" : ""}{formatINR(Math.abs(p.actuarialGainLoss))}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-emerald-600 font-medium tabular-nums">{formatINR(p.fundedAmount || 0)}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={cn("text-xs font-bold tabular-nums", p.unfundedLiability > 0 ? "text-rose-500" : "text-slate-400")}>{formatINR(p.unfundedLiability)}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-[10px] text-slate-500">{p.recordedBy}<p className="text-[9px] text-slate-400">{p.recordedDate}</p></td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => openProvisionDialog(p)}>
                                                                    <Edit size={12} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-500" onClick={() => setDeleteProvisionId(p.id)}>
                                                                    <Trash2 size={12} />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </ScrollArea>

                                    {/* Trend chart */}
                                    {gratuityProvisions.length > 1 && (
                                        <div className="p-5 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <LineChart size={13} className="text-[#8B5CF6]" />
                                                    <p className="text-[11px] font-bold text-slate-700">Total liability trend</p>
                                                </div>
                                                <p className="text-[10px] text-slate-500 tabular-nums">Min {formatINR(provisionTrend.minV)} · Max {formatINR(provisionTrend.maxV)}</p>
                                            </div>
                                            <div className="w-full overflow-x-auto">
                                                <svg width={provisionTrend.width} height={provisionTrend.height} className="block">
                                                    <defs>
                                                        <linearGradient id="liabGrad" x1="0" x2="0" y1="0" y2="1">
                                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                                                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {provisionTrend.points.length > 1 && (
                                                        <>
                                                            <polygon
                                                                fill="url(#liabGrad)"
                                                                points={`${provisionTrend.points[0].x},${provisionTrend.height - 12} ${provisionTrend.poly} ${provisionTrend.points[provisionTrend.points.length - 1].x},${provisionTrend.height - 12}`}
                                                            />
                                                            <polyline fill="none" stroke="#8B5CF6" strokeWidth="2" points={provisionTrend.poly} />
                                                        </>
                                                    )}
                                                    {provisionTrend.points.map((pt, idx) => (
                                                        <g key={idx}>
                                                            <circle cx={pt.x} cy={pt.y} r="3" fill="#8B5CF6" />
                                                            <text x={pt.x} y={provisionTrend.height - 2} textAnchor="middle" className="fill-slate-400" style={{ fontSize: "9px", fontWeight: 600 }}>{pt.label}</text>
                                                        </g>
                                                    ))}
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* LWF Add/Edit Sheet */}
            <SideFormSheet
                open={isLwfAddOpen}
                onOpenChange={(o) => { setIsLwfAddOpen(o); if (!o) setEditLwf(null) }}
                title={editLwf ? "Edit LWF Record" : "Add LWF Record"}
                description="Contributions are based on state rates."
                icon={<Gift size={20} />}
                accentColor={editLwf ? "#7c3aed" : "#4f46e5"}
                width="md"
                submitLabel={editLwf ? "Update" : "Add"}
                onSubmit={(e) => { e.preventDefault(); handleLwfSave(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee ID">
                            <Input value={lwfForm.employeeId} onChange={(e) => setLwfForm({ ...lwfForm, employeeId: e.target.value })} disabled={!!editLwf} />
                        </Field>
                        <Field label="Employee Name">
                            <Input value={lwfForm.employeeName} onChange={(e) => setLwfForm({ ...lwfForm, employeeName: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="State">
                            <Select value={lwfForm.state} onValueChange={(v) => setLwfForm({ ...lwfForm, state: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(lwfRates).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Period">
                            <Input value={lwfForm.period} onChange={(e) => setLwfForm({ ...lwfForm, period: e.target.value })} />
                        </Field>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contribution Preview</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-slate-500">Employee:</span> <span className="font-bold text-slate-700">₹{lwfRates[lwfForm.state]?.employee || 0}</span></div>
                            <div><span className="text-slate-500">Employer:</span> <span className="font-bold text-slate-700">₹{lwfRates[lwfForm.state]?.employer || 0}</span></div>
                        </div>
                    </div>
                </div>
            </SideFormSheet>

            {/* Gratuity Add/Edit Sheet */}
            <SideFormSheet
                open={isGratuityAddOpen}
                onOpenChange={(o) => { setIsGratuityAddOpen(o); if (!o) setEditGratuity(null) }}
                title={editGratuity ? "Edit Gratuity Record" : "Add Gratuity Record"}
                description="Gratuity auto-calculated: (15 x salary x years) / 26"
                icon={<PiggyBank size={20} />}
                accentColor={editGratuity ? "#7c3aed" : "#4f46e5"}
                width="md"
                submitLabel={editGratuity ? "Update" : "Add"}
                onSubmit={(e) => { e.preventDefault(); handleGratuitySave(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee ID">
                            <Input value={gratuityForm.employeeId} onChange={(e) => setGratuityForm({ ...gratuityForm, employeeId: e.target.value })} disabled={!!editGratuity} />
                        </Field>
                        <Field label="Employee Name">
                            <Input value={gratuityForm.employeeName} onChange={(e) => setGratuityForm({ ...gratuityForm, employeeName: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Date of Joining">
                        <Input type="date" value={gratuityForm.dateOfJoining} onChange={(e) => setGratuityForm({ ...gratuityForm, dateOfJoining: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Years of Service">
                            <Input type="number" value={gratuityForm.yearsOfService} onChange={(e) => setGratuityForm({ ...gratuityForm, yearsOfService: e.target.value })} />
                        </Field>
                        <Field label="Last Drawn Salary (₹)">
                            <Input type="number" value={gratuityForm.lastDrawnSalary} onChange={(e) => setGratuityForm({ ...gratuityForm, lastDrawnSalary: e.target.value })} />
                        </Field>
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
            </SideFormSheet>

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

            {/* Record / Edit Gratuity Provision Sheet */}
            <SideFormSheet
                open={isProvisionOpen}
                onOpenChange={(o) => { setIsProvisionOpen(o); if (!o) setEditProvision(null) }}
                title={editProvision ? "Edit gratuity provision" : "Record gratuity provision"}
                description="Monthly actuarial provision (pre-filled from computation)"
                icon={<LineChart size={20} />}
                accentColor={editProvision ? "#7c3aed" : "#4f46e5"}
                width="xl"
                submitLabel={editProvision ? "Update" : "Record"}
                onSubmit={(e) => { e.preventDefault(); handleProvisionSave(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Month">
                            <Input value={provisionForm.month} onChange={(e) => setProvisionForm({ ...provisionForm, month: e.target.value })} />
                        </Field>
                        <Field label="Recorded by">
                            <Input value={provisionForm.recordedBy} onChange={(e) => setProvisionForm({ ...provisionForm, recordedBy: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Total liability (₹)">
                            <Input type="number" className="tabular-nums" value={provisionForm.totalLiability} onChange={(e) => setProvisionForm({ ...provisionForm, totalLiability: e.target.value })} />
                        </Field>
                        <Field label="Current service cost (₹)">
                            <Input type="number" className="tabular-nums" value={provisionForm.currentServiceCost} onChange={(e) => setProvisionForm({ ...provisionForm, currentServiceCost: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Interest cost (₹)">
                            <Input type="number" className="tabular-nums" value={provisionForm.interestCost} onChange={(e) => setProvisionForm({ ...provisionForm, interestCost: e.target.value })} />
                        </Field>
                        <Field label="Actuarial gain/loss (₹)">
                            <Input type="number" className="tabular-nums" value={provisionForm.actuarialGainLoss} onChange={(e) => setProvisionForm({ ...provisionForm, actuarialGainLoss: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Funded amount (₹)">
                            <Input type="number" className="tabular-nums" value={provisionForm.fundedAmount} onChange={(e) => setProvisionForm({ ...provisionForm, fundedAmount: e.target.value })} />
                        </Field>
                        <Field label="Eligible employees">
                            <Input type="number" className="tabular-nums" value={provisionForm.eligibleEmployeeCount} onChange={(e) => setProvisionForm({ ...provisionForm, eligibleEmployeeCount: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Discount rate %">
                            <Input type="number" step={0.1} className="tabular-nums" value={provisionForm.discountRate} onChange={(e) => setProvisionForm({ ...provisionForm, discountRate: e.target.value })} />
                        </Field>
                        <Field label="Salary growth %">
                            <Input type="number" step={0.1} className="tabular-nums" value={provisionForm.salaryGrowthRate} onChange={(e) => setProvisionForm({ ...provisionForm, salaryGrowthRate: e.target.value })} />
                        </Field>
                        <Field label="Attrition %">
                            <Input type="number" step={0.1} className="tabular-nums" value={provisionForm.attritionRate} onChange={(e) => setProvisionForm({ ...provisionForm, attritionRate: e.target.value })} />
                        </Field>
                    </div>
                    {(() => {
                        const tl = parseFloat(provisionForm.totalLiability) || 0
                        const fd = parseFloat(provisionForm.fundedAmount) || 0
                        const un = Math.max(tl - fd, 0)
                        return (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Computed unfunded liability</p>
                                <p className={cn("text-sm font-bold tabular-nums", un > 0 ? "text-rose-500" : "text-emerald-500")}>{formatINR(un)}</p>
                            </div>
                        )
                    })()}
                </div>
            </SideFormSheet>

            {/* Delete Provision Confirm */}
            <Dialog open={!!deleteProvisionId} onOpenChange={(o) => { if (!o) setDeleteProvisionId(null) }}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Delete provision?</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">This action cannot be undone. The monthly provision entry will be permanently removed.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => setDeleteProvisionId(null)}>Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white h-9 rounded-lg text-xs font-bold shadow-lg shadow-rose-500/20" onClick={handleProvisionDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit State LWF Config Sheet */}
            <SideFormSheet
                open={isStateCfgOpen}
                onOpenChange={(o) => { setIsStateCfgOpen(o); if (!o) setEditStateCfg(null) }}
                title={editStateCfg?.state ? `${editStateCfg.state} LWF configuration` : "LWF configuration"}
                description="Update contribution rates, frequency and filing schedule"
                icon={<MapPin size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Update"
                onSubmit={(e) => { e.preventDefault(); handleStateCfgSave(); }}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                            <p className="text-xs font-bold text-slate-700">Applicable in state</p>
                            <p className="text-[10px] text-slate-500">Disable to exclude this state from filing</p>
                        </div>
                        <Switch checked={stateCfgForm.applicable} onCheckedChange={(v) => setStateCfgForm({ ...stateCfgForm, applicable: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee contribution">
                            <Input type="number" step={0.01} className="tabular-nums" value={stateCfgForm.employeeContribution} onChange={(e) => setStateCfgForm({ ...stateCfgForm, employeeContribution: e.target.value })} />
                        </Field>
                        <Field label="Employer contribution">
                            <Input type="number" step={0.01} className="tabular-nums" value={stateCfgForm.employerContribution} onChange={(e) => setStateCfgForm({ ...stateCfgForm, employerContribution: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Frequency">
                            <Select value={stateCfgForm.frequency} onValueChange={(v) => setStateCfgForm({ ...stateCfgForm, frequency: v as StateLwfConfig['frequency'] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                                    <SelectItem value="Annually">Annually</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Due date">
                            <Input value={stateCfgForm.dueDate} onChange={(e) => setStateCfgForm({ ...stateCfgForm, dueDate: e.target.value })} placeholder="e.g. 15-Jul, 15-Jan" />
                        </Field>
                    </div>
                    <Field label="Notes">
                        <Input value={stateCfgForm.notes} onChange={(e) => setStateCfgForm({ ...stateCfgForm, notes: e.target.value })} placeholder="Optional notes" />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    )
}

export default LWFGratuityPage
