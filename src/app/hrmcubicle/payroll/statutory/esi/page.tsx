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
import { useStatutoryStore, ESIRecord } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const ESI_WAGE_LIMIT = 21000
const ESI_EE_RATE = 0.0075
const ESI_ER_RATE = 0.0325

const ESIManagement = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { esiRecords, addESIRecord, updateESIRecord, deleteESIRecord } = useStatutoryStore()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editRecord, setEditRecord] = useState<ESIRecord | null>(null)
    const [formData, setFormData] = useState({ employeeId: "", employeeName: "", esicNumber: "", month: "Mar 2026", grossWage: "" })

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
                </div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) setEditRecord(null) }}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editRecord ? "Edit ESI Record" : "Add ESI Record"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editRecord ? "Update the ESI contribution details." : "Enter employee details. Contributions auto-calculated (EE: 0.75%, ER: 3.25%)."}
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
                                <Label className="text-xs font-bold text-slate-500">ESIC Number</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.esicNumber} onChange={(e) => setFormData({ ...formData, esicNumber: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Month</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Gross Wage (₹)</Label>
                            <Input className="h-9 text-xs rounded-lg" type="number" value={formData.grossWage} onChange={(e) => setFormData({ ...formData, grossWage: e.target.value })} />
                        </div>
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

export default ESIManagement
