"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Landmark,
    Download,
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
    Upload,
    Search,
    Filter,
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
import { useStatutoryStore, PFRecord } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const PFManagement = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { pfRecords, addPFRecord, updatePFRecord, deletePFRecord } = useStatutoryStore()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editRecord, setEditRecord] = useState<PFRecord | null>(null)
    const [formData, setFormData] = useState({ employeeId: "", employeeName: "", uan: "", month: "Mar 2026", basicPay: "" })

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

    const transferRequests = [
        { id: "TR-1", employee: "Arjun Mehta", type: "Transfer", from: "Previous Employer", status: "In Progress", date: "2026-02-20" },
        { id: "TR-2", employee: "Sneha Kulkarni", type: "Withdrawal", from: "Form 19", status: "Submitted", date: "2026-03-05" },
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                        {/* Transfer / Withdrawal Requests */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Transfer & Withdrawal Requests</h3>
                                    <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{transferRequests.length} active</Badge>
                                </div>
                                <div className="p-4 space-y-3">
                                    {transferRequests.map((req) => (
                                        <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", req.type === "Transfer" ? "bg-blue-50 text-blue-500" : "bg-amber-50 text-amber-500")}>
                                                {req.type === "Transfer" ? <Upload size={14} /> : <Download size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-bold text-slate-700">{req.employee}</p>
                                                    <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(req.status))}>{req.status}</Badge>
                                                </div>
                                                <p className="text-[10px] text-slate-400">{req.type} - {req.from} | {req.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) setEditRecord(null) }}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editRecord ? "Edit PF Record" : "Add PF Record"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editRecord ? "Update the PF contribution details." : "Enter employee details. Contributions will be auto-calculated at 12%."}
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
                                <Label className="text-xs font-bold text-slate-500">UAN</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.uan} onChange={(e) => setFormData({ ...formData, uan: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Month</Label>
                                <Input className="h-9 text-xs rounded-lg" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Basic Pay (₹)</Label>
                            <Input className="h-9 text-xs rounded-lg" type="number" value={formData.basicPay} onChange={(e) => setFormData({ ...formData, basicPay: e.target.value })} />
                        </div>
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

export default PFManagement
