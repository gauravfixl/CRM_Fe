"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    FileText,
    ChevronLeft,
    Download,
    Users,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    Eye,
    FileDown,
    Printer,
    Archive,
    TrendingUp,
    IndianRupee,
    CalendarDays,
    AlertTriangle,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Input } from "@/shared/components/ui/input"
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
import { useStatutoryStore, Form16Record } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const Form16Page = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { form16Records, form24QRecords, updateForm16Record, updateForm24QRecord } = useStatutoryStore()
    const [activeTab, setActiveTab] = useState("form16")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [previewRecord, setPreviewRecord] = useState<Form16Record | null>(null)

    // Form 12BB mock data
    const form12BBData = [
        { employeeId: "EMP001", employeeName: "Arjun Mehta", hra: 180000, section80C: 150000, section80D: 25000, homeLoan: 200000, status: "Submitted" },
        { employeeId: "EMP002", employeeName: "Priya Sharma", hra: 144000, section80C: 120000, section80D: 15000, homeLoan: 0, status: "Submitted" },
        { employeeId: "EMP003", employeeName: "Rahul Iyer", hra: 204000, section80C: 150000, section80D: 50000, homeLoan: 300000, status: "Pending" },
        { employeeId: "EMP004", employeeName: "Sneha Kulkarni", hra: 120000, section80C: 80000, section80D: 25000, homeLoan: 0, status: "Verified" },
    ]

    const filtered = useMemo(() => {
        return form16Records.filter((r) => {
            const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "all" ||
                (statusFilter === "Generated" && (r.partAStatus === "Generated" || r.partBStatus === "Generated")) ||
                (statusFilter === "Pending" && (r.partAStatus === "Pending" || r.partBStatus === "Pending")) ||
                (statusFilter === "Issued" && (r.partAStatus === "Issued" && r.partBStatus === "Issued"))
            return matchSearch && matchStatus
        })
    }, [form16Records, search, statusFilter])

    const stats = useMemo(() => {
        const issued = form16Records.filter((r) => r.partAStatus === "Issued" && r.partBStatus === "Issued").length
        const generated = form16Records.filter((r) => r.partAStatus !== "Pending" || r.partBStatus !== "Pending").length
        const totalTax = form16Records.reduce((s, r) => s + r.totalTaxDeducted, 0)
        const totalIncome = form16Records.reduce((s, r) => s + r.totalIncome, 0)
        return { issued, generated, total: form16Records.length, totalTax, totalIncome }
    }, [form16Records])

    const statusColor = (s: string) => {
        switch (s) {
            case "Issued": case "Acknowledged": case "Verified": return "bg-emerald-50 text-emerald-600"
            case "Generated": case "Filed": case "Submitted": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const handleBulkGenerate = () => {
        form16Records.forEach((r) => {
            if (r.partAStatus === "Pending") {
                updateForm16Record(r.id, { partAStatus: "Generated", generatedDate: new Date().toISOString().split("T")[0] })
            }
            if (r.partBStatus === "Pending") {
                updateForm16Record(r.id, { partBStatus: "Generated", generatedDate: new Date().toISOString().split("T")[0] })
            }
        })
        toast({ title: "Bulk Generation Complete", description: `Form 16 generated for all pending employees.` })
    }

    const handleDownloadAll = () => {
        const headers = ["Employee ID,Employee Name,Fiscal Year,Part A Status,Part B Status,Total Income,Total Tax Deducted,Generated Date"]
        const rows = form16Records.map((r) => `${r.employeeId},${r.employeeName},${r.fiscalYear},${r.partAStatus},${r.partBStatus},${r.totalIncome},${r.totalTaxDeducted},${r.generatedDate || "N/A"}`)
        const csv = [...headers, ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Form16_All_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "Download Complete", description: "All Form 16 data exported as CSV (mock ZIP)." })
    }

    const handleDownloadSingle = (record: Form16Record) => {
        const content = [
            "FORM No. 16",
            `[See rule 31(1)(a)]`,
            `Certificate under section 203 of the Income-tax Act, 1961`,
            "",
            `Employee Name: ${record.employeeName}`,
            `Employee ID: ${record.employeeId}`,
            `Fiscal Year: ${record.fiscalYear}`,
            `Assessment Year: 2026-27`,
            "",
            "PART A",
            `Total Income: ₹${record.totalIncome.toLocaleString("en-IN")}`,
            `Total Tax Deducted: ₹${record.totalTaxDeducted.toLocaleString("en-IN")}`,
            "",
            "PART B (Annexure)",
            "Gross Salary as per Section 17(1): " + record.totalIncome.toLocaleString("en-IN"),
            "Less: Deductions under Chapter VI-A: Applicable",
            `Tax on Total Income: ₹${record.totalTaxDeducted.toLocaleString("en-IN")}`,
        ].join("\n")
        const blob = new Blob([content], { type: "text/plain" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Form16_${record.employeeName.replace(/\s/g, "_")}_${record.fiscalYear}.txt`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "Downloaded", description: `Form 16 for ${record.employeeName} downloaded.` })
    }

    const handleMarkIssued = (id: string, name: string) => {
        updateForm16Record(id, { partAStatus: "Issued", partBStatus: "Issued" })
        toast({ title: "Marked as Issued", description: `Form 16 for ${name} marked as issued.` })
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => router.push("/hrmcubicle/payroll/statutory")}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="h-10 w-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Form 16 & 24Q</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">TDS Certificates & Quarterly Returns</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={handleDownloadAll}>
                        <Archive size={14} /> Download All (ZIP)
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none gap-2" onClick={handleBulkGenerate}>
                        <Printer size={14} /> Bulk Generate
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-6 pb-32">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-white border border-slate-200 rounded-xl p-1 h-auto">
                            <TabsTrigger value="form16" className="rounded-lg text-xs font-bold px-6 py-2.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
                                <FileText size={14} className="mr-2" /> Form 16
                            </TabsTrigger>
                            <TabsTrigger value="form24q" className="rounded-lg text-xs font-bold px-6 py-2.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
                                <CalendarDays size={14} className="mr-2" /> Form 24Q
                            </TabsTrigger>
                            <TabsTrigger value="form12bb" className="rounded-lg text-xs font-bold px-6 py-2.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
                                <FileDown size={14} className="mr-2" /> Form 12BB
                            </TabsTrigger>
                        </TabsList>

                        {/* Form 16 Tab */}
                        <TabsContent value="form16" className="mt-6 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: "Total Employees", val: stats.total.toString(), icon: Users, color: "text-cyan-500", bg: "bg-cyan-50", trend: "FY 2025-26" },
                                    { label: "Form 16 Generated", val: `${stats.generated}/${stats.total}`, icon: FileText, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: `${Math.round((stats.generated / Math.max(stats.total, 1)) * 100)}%` },
                                    { label: "Total Tax Deducted", val: `₹${(stats.totalTax / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50", trend: "FY 2025-26" },
                                    { label: "Issued to Employees", val: `${stats.issued}/${stats.total}`, icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-50", trend: `${Math.round((stats.issued / Math.max(stats.total, 1)) * 100)}% complete` },
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

                            {/* Filters */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="Search employees..." className="pl-9 h-10 rounded-lg border-slate-200 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[160px] h-10 rounded-lg border-slate-200 text-xs font-medium">
                                        <Filter size={12} className="mr-1.5" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Generated">Generated</SelectItem>
                                        <SelectItem value="Issued">Issued</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Form 16 Table */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900">Form 16 Generation Dashboard</h3>
                                        <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">FY 2025-26</Badge>
                                    </div>
                                    <ScrollArea className="max-h-[420px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50 z-10">
                                                <tr>
                                                    {["Employee", "Fiscal Year", "Total Income", "Tax Deducted", "Part A", "Part B", "Generated Date", "Actions"].map((h) => (
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
                                                        <td className="px-4 py-3 text-xs text-slate-600">{r.fiscalYear}</td>
                                                        <td className="px-4 py-3 text-xs font-bold text-slate-700">₹{r.totalIncome.toLocaleString("en-IN")}</td>
                                                        <td className="px-4 py-3 text-xs font-bold text-[#8B5CF6]">₹{r.totalTaxDeducted.toLocaleString("en-IN")}</td>
                                                        <td className="px-4 py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.partAStatus))}>{r.partAStatus}</Badge></td>
                                                        <td className="px-4 py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.partBStatus))}>{r.partBStatus}</Badge></td>
                                                        <td className="px-4 py-3 text-xs text-slate-500">{r.generatedDate || "-"}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => setPreviewRecord(r)} title="Preview">
                                                                    <Eye size={12} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-emerald-500" onClick={() => handleDownloadSingle(r)} title="Download">
                                                                    <Download size={12} />
                                                                </Button>
                                                                {r.partAStatus !== "Issued" && (
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-blue-500" onClick={() => handleMarkIssued(r.id, r.employeeName)} title="Mark Issued">
                                                                        <CheckCircle2 size={12} />
                                                                    </Button>
                                                                )}
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

                        {/* Form 24Q Tab */}
                        <TabsContent value="form24q" className="mt-6 space-y-6">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                                <CalendarDays size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-blue-700">Form 24Q - Quarterly TDS Return for Salaries</p>
                                    <p className="text-[10px] text-blue-500 mt-0.5">Filed quarterly with TRACES. Due dates: Q1 (31 Jul), Q2 (31 Oct), Q3 (31 Jan), Q4 (31 May)</p>
                                </div>
                            </div>

                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900">Quarterly Filing Tracker - FY 2025-26</h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            {form24QRecords.map((q) => (
                                                <Card key={q.id} className={cn("rounded-xl border overflow-hidden", q.status === "Acknowledged" ? "border-emerald-200 bg-emerald-50/30" : q.status === "Filed" ? "border-blue-200 bg-blue-50/30" : "border-amber-200 bg-amber-50/30")}>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <p className="text-lg font-bold text-slate-900">{q.quarter}</p>
                                                            <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(q.status))}>{q.status}</Badge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-[10px]">
                                                                <span className="text-slate-400">Employees</span>
                                                                <span className="font-bold text-slate-700">{q.employeeCount}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px]">
                                                                <span className="text-slate-400">Tax Deducted</span>
                                                                <span className="font-bold text-slate-700">₹{(q.totalTaxDeducted / 100000).toFixed(1)}L</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px]">
                                                                <span className="text-slate-400">Filing Date</span>
                                                                <span className="font-bold text-slate-700">{q.filingDate || "Not filed"}</span>
                                                            </div>
                                                        </div>
                                                        {q.status === "Pending" && (
                                                            <Button className="w-full mt-3 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-8 text-[10px] font-bold shadow-lg shadow-[#8B5CF6]/20" onClick={() => {
                                                                updateForm24QRecord(q.id, { status: "Filed", filingDate: new Date().toISOString().split("T")[0] })
                                                                toast({ title: "Filed", description: `Form 24Q ${q.quarter} marked as filed.` })
                                                            }}>
                                                                Mark as Filed
                                                            </Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    {["Quarter", "Fiscal Year", "Employees", "Tax Deducted", "Filing Date", "Status"].map((h) => (
                                                        <th key={h} className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {form24QRecords.map((q) => (
                                                    <tr key={q.id} className="border-b border-slate-50 last:border-none">
                                                        <td className="py-3 text-xs font-bold text-slate-700">{q.quarter}</td>
                                                        <td className="py-3 text-xs text-slate-600">{q.fiscalYear}</td>
                                                        <td className="py-3 text-xs text-slate-600">{q.employeeCount}</td>
                                                        <td className="py-3 text-xs font-bold text-slate-700">₹{q.totalTaxDeducted.toLocaleString("en-IN")}</td>
                                                        <td className="py-3 text-xs text-slate-500">{q.filingDate || "-"}</td>
                                                        <td className="py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(q.status))}>{q.status}</Badge></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Form 12BB Tab */}
                        <TabsContent value="form12bb" className="mt-6 space-y-6">
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                                <FileDown size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-amber-700">Form 12BB - Statement of Claims by Employee for Deduction of Tax</p>
                                    <p className="text-[10px] text-amber-500 mt-0.5">Employees submit Form 12BB to claim HRA, LTA, home loan interest, and Chapter VI-A deductions for TDS computation.</p>
                                </div>
                            </div>

                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900">Employee Investment Declarations (Form 12BB)</h3>
                                        <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">FY 2025-26</Badge>
                                    </div>
                                    <ScrollArea className="max-h-[400px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50 z-10">
                                                <tr>
                                                    {["Employee", "HRA Claimed", "Sec 80C", "Sec 80D", "Home Loan Interest", "Total Claims", "Status"].map((h) => (
                                                        <th key={h} className="text-[10px] font-bold text-slate-400 px-4 py-3 text-left uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {form12BBData.map((r, i) => {
                                                    const total = r.hra + r.section80C + r.section80D + r.homeLoan
                                                    return (
                                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3">
                                                                <p className="text-xs font-bold text-slate-700">{r.employeeName}</p>
                                                                <p className="text-[10px] text-slate-400">{r.employeeId}</p>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.hra.toLocaleString("en-IN")}</td>
                                                            <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.section80C.toLocaleString("en-IN")}</td>
                                                            <td className="px-4 py-3 text-xs font-medium text-slate-600">₹{r.section80D.toLocaleString("en-IN")}</td>
                                                            <td className="px-4 py-3 text-xs font-medium text-slate-600">{r.homeLoan > 0 ? `₹${r.homeLoan.toLocaleString("en-IN")}` : "-"}</td>
                                                            <td className="px-4 py-3 text-xs font-bold text-[#8B5CF6]">₹{total.toLocaleString("en-IN")}</td>
                                                            <td className="px-4 py-3"><Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(r.status))}>{r.status}</Badge></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Form 16 Preview Dialog */}
            <Dialog open={!!previewRecord} onOpenChange={() => setPreviewRecord(null)}>
                <DialogContent className="sm:max-w-[560px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Form 16 Preview</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Certificate under section 203 of the Income-tax Act, 1961
                        </DialogDescription>
                    </DialogHeader>
                    {previewRecord && (
                        <div className="space-y-4 py-2">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="text-center mb-4">
                                    <p className="text-sm font-bold text-slate-900">FORM No. 16</p>
                                    <p className="text-[10px] text-slate-400">[See rule 31(1)(a)]</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source from income chargeable under the head "Salaries"</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Employee Name</p>
                                            <p className="text-xs font-bold text-slate-700">{previewRecord.employeeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Employee ID</p>
                                            <p className="text-xs text-slate-600">{previewRecord.employeeId}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Fiscal Year</p>
                                            <p className="text-xs font-bold text-slate-700">{previewRecord.fiscalYear}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Assessment Year</p>
                                            <p className="text-xs text-slate-600">2026-27</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-3 mt-3">
                                    <p className="text-xs font-bold text-slate-700 mb-2">PART A - Details of Tax Deducted</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                                            <p className="text-[10px] text-slate-400">Gross Salary</p>
                                            <p className="text-sm font-bold text-slate-700">₹{previewRecord.totalIncome.toLocaleString("en-IN")}</p>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                                            <p className="text-[10px] text-slate-400">Total Tax Deducted</p>
                                            <p className="text-sm font-bold text-[#8B5CF6]">₹{previewRecord.totalTaxDeducted.toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-3 mt-3">
                                    <p className="text-xs font-bold text-slate-700 mb-2">PART B - Annexure</p>
                                    <div className="space-y-1.5">
                                        {[
                                            { label: "Gross Salary (Sec 17(1))", val: `₹${previewRecord.totalIncome.toLocaleString("en-IN")}` },
                                            { label: "Less: Standard Deduction", val: "₹50,000" },
                                            { label: "Net Taxable Income", val: `₹${(previewRecord.totalIncome - 50000).toLocaleString("en-IN")}` },
                                            { label: "Tax on Total Income", val: `₹${previewRecord.totalTaxDeducted.toLocaleString("en-IN")}` },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between text-[10px]">
                                                <span className="text-slate-500">{item.label}</span>
                                                <span className="font-bold text-slate-700">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(previewRecord.partAStatus))}>Part A: {previewRecord.partAStatus}</Badge>
                                <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(previewRecord.partBStatus))}>Part B: {previewRecord.partBStatus}</Badge>
                                {previewRecord.generatedDate && <span className="text-[10px] text-slate-400 ml-2">Generated: {previewRecord.generatedDate}</span>}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="h-9 rounded-lg text-xs font-bold" onClick={() => setPreviewRecord(null)}>Close</Button>
                        {previewRecord && (
                            <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white h-9 rounded-lg text-xs font-bold shadow-lg shadow-[#8B5CF6]/20 gap-2" onClick={() => { handleDownloadSingle(previewRecord); setPreviewRecord(null) }}>
                                <Download size={12} /> Download
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Form16Page
