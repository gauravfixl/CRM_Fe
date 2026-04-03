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
import { useToast } from "@/shared/components/ui/use-toast"
import { useStatutoryStore, PTRecord } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const PTManagement = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { ptRecords, ptSlabs, addPTRecord, updatePTRecord, deletePTRecord } = useStatutoryStore()
    const [search, setSearch] = useState("")
    const [stateFilter, setStateFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editRecord, setEditRecord] = useState<PTRecord | null>(null)
    const [slabDialogState, setSlabDialogState] = useState<string | null>(null)
    const [formData, setFormData] = useState({ employeeId: "", employeeName: "", state: "Maharashtra", month: "Mar 2026", grossSalary: "" })

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
                </div>
            </div>

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
        </div>
    )
}

export default PTManagement
