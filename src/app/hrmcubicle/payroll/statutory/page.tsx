"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldCheck,
    Building2,
    Landmark,
    Scale,
    FileText,
    Gift,
    ChevronRight,
    CalendarDays,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowRight,
    TrendingUp,
    Download,
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { useToast } from "@/shared/components/ui/use-toast"
import { useStatutoryStore } from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"

const StatutoryDashboard = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        pfRecords,
        esiRecords,
        ptRecords,
        lwfRecords,
        gratuityRecords,
        form16Records,
        complianceEvents,
    } = useStatutoryStore()

    const stats = useMemo(() => {
        const pfFiled = pfRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const pfCompliance = pfRecords.length > 0 ? Math.round((pfFiled / pfRecords.length) * 100) : 0

        const esiCoverage = esiRecords.filter((r) => r.grossWage <= 21000).length
        const esiPct = esiRecords.length > 0 ? Math.round((esiCoverage / esiRecords.length) * 100) : 0

        const ptFiled = ptRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const ptPct = ptRecords.length > 0 ? Math.round((ptFiled / ptRecords.length) * 100) : 0

        const lwfFiled = lwfRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const lwfPct = lwfRecords.length > 0 ? Math.round((lwfFiled / lwfRecords.length) * 100) : 0

        const gratuityProvisioned = gratuityRecords.filter((r) => r.status === "Provisioned" || r.status === "Paid").reduce((sum, r) => sum + r.gratuityAmount, 0)

        const form16Generated = form16Records.filter((r) => r.partAStatus !== "Pending" || r.partBStatus !== "Pending").length
        const form16Pct = form16Records.length > 0 ? Math.round((form16Generated / form16Records.length) * 100) : 0

        return { pfCompliance, esiPct, ptPct, lwfPct, gratuityProvisioned, form16Pct, form16Generated }
    }, [pfRecords, esiRecords, ptRecords, lwfRecords, gratuityRecords, form16Records])

    const kpis = [
        { label: "PF Compliance", val: `${stats.pfCompliance}%`, icon: Landmark, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/20", trend: `${pfRecords.length} employees`, cardBg: "bg-[#CB9DF0]/15 border-[#CB9DF0]/30" },
        { label: "ESI Coverage", val: `${stats.esiPct}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100", trend: `${esiRecords.length} eligible`, cardBg: "bg-emerald-50 border-emerald-200" },
        { label: "PT Filed", val: `${stats.ptPct}%`, icon: Building2, color: "text-blue-600", bg: "bg-blue-100", trend: `${ptRecords.length} employees`, cardBg: "bg-blue-50 border-blue-200" },
        { label: "LWF Status", val: `${stats.lwfPct}%`, icon: Scale, color: "text-amber-600", bg: "bg-amber-100", trend: `${lwfRecords.length} records`, cardBg: "bg-amber-50 border-amber-200" },
        { label: "Gratuity Provisioned", val: `₹${(stats.gratuityProvisioned / 100000).toFixed(1)}L`, icon: Gift, color: "text-pink-600", bg: "bg-pink-100", trend: `${gratuityRecords.filter((r) => r.status !== "Not Eligible").length} eligible`, cardBg: "bg-pink-50 border-pink-200" },
        { label: "Form 16 Generated", val: `${stats.form16Pct}%`, icon: FileText, color: "text-cyan-600", bg: "bg-cyan-100", trend: `${stats.form16Generated}/${form16Records.length}`, cardBg: "bg-cyan-50 border-cyan-200" },
    ]

    const modules = [
        { label: "Provident Fund", desc: "EPF/EPS/EDLI management", icon: Landmark, path: "/hrmcubicle/payroll/statutory/pf", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
        { label: "ESI", desc: "ESI contributions & challans", icon: ShieldCheck, path: "/hrmcubicle/payroll/statutory/esi", color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Professional Tax", desc: "State-wise PT deductions", icon: Building2, path: "/hrmcubicle/payroll/statutory/professional-tax", color: "text-blue-500", bg: "bg-blue-50" },
        { label: "LWF & Gratuity", desc: "Labour welfare & gratuity", icon: Gift, path: "/hrmcubicle/payroll/statutory/lwf-gratuity", color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Form 16 & 24Q", desc: "TDS certificates & returns", icon: FileText, path: "/hrmcubicle/payroll/statutory/form16", color: "text-cyan-500", bg: "bg-cyan-50" },
    ]

    const sortedEvents = [...complianceEvents].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    const recentActivity = [
        { text: "PF ECR filed for Feb 2026", time: "2 days ago", type: "success" as const },
        { text: "ESI challan generated for Feb 2026", time: "3 days ago", type: "success" as const },
        { text: "PT return Q3 filed - Maharashtra", time: "5 days ago", type: "success" as const },
        { text: "Form 16 Part A generated for 2 employees", time: "1 day ago", type: "info" as const },
        { text: "Gratuity provisioning updated for Mar 2026", time: "4 days ago", type: "info" as const },
    ]

    const monthlyFilingStatus = [
        { month: "Jan 2026", pf: "Paid", esi: "Paid", pt: "Filed", tds: "Paid" },
        { month: "Feb 2026", pf: "Paid", esi: "Paid", pt: "Filed", tds: "Paid" },
        { month: "Mar 2026", pf: "Pending", esi: "Pending", pt: "Pending", tds: "Pending" },
    ]

    const statusColor = (s: string) => {
        switch (s) {
            case "Paid": case "Completed": case "Acknowledged": return "bg-emerald-50 text-emerald-600"
            case "Filed": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            case "Due Today": return "bg-red-50 text-red-600"
            case "Overdue": return "bg-red-100 text-red-700"
            case "Upcoming": return "bg-slate-50 text-slate-500"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const handleExportSummary = () => {
        const headers = ["Type", "Metric", "Value"]
        const rows = kpis.map((k) => [k.label, k.val, k.trend])
        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `statutory_compliance_summary_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({ title: "Summary Exported", description: "Statutory compliance summary downloaded." })
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "90%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Statutory Compliance</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">Indian Labour Law Compliance Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600" onClick={handleExportSummary}>
                        <Download size={14} /> Export Summary
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none" onClick={() => router.push("/hrmcubicle/payroll/statutory/pf")}>
                        File Returns <ChevronRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-8 pb-32">
                    {/* KPI Tiles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {kpis.map((stat, i) => (
                            <Card key={i} className={cn("rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all", stat.cardBg)}>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-white/60">{stat.trend}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {modules.map((m, i) => (
                                <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push(m.path)}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`h-9 w-9 ${m.bg} ${m.color} rounded-lg flex items-center justify-center`}>
                                                <m.icon size={18} />
                                            </div>
                                            <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-[#8B5CF6] transition-colors" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{m.label}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{m.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Compliance Calendar */}
                        <Card className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={16} className="text-[#8B5CF6]" />
                                        <h3 className="text-sm font-bold text-slate-900">Compliance Calendar</h3>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100">{sortedEvents.length} events</Badge>
                                </div>
                                <ScrollArea className="h-[340px]">
                                    <div className="p-4 space-y-2.5">
                                        {sortedEvents.map((ev) => (
                                            <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", statusColor(ev.status))}>
                                                    {ev.status === "Due Today" || ev.status === "Overdue" ? <AlertTriangle size={14} /> : ev.status === "Completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-700 truncate">{ev.title}</p>
                                                    <p className="text-[10px] font-medium text-slate-400">{new Date(ev.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                                </div>
                                                <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(ev.status))}>{ev.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-emerald-500" />
                                    <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                                </div>
                                <ScrollArea className="h-[340px]">
                                    <div className="p-4 space-y-3">
                                        {recentActivity.map((act, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center mt-0.5", act.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500")}>
                                                    <CheckCircle2 size={12} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-slate-700">{act.text}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Monthly Filing Status */}
                        <Card className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                                    <FileText size={16} className="text-blue-500" />
                                    <h3 className="text-sm font-bold text-slate-900">Monthly Filing Status</h3>
                                </div>
                                <div className="p-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-[10px] font-bold text-slate-400 pb-3 text-left uppercase tracking-wider">Month</th>
                                                <th className="text-[10px] font-bold text-slate-400 pb-3 text-center uppercase tracking-wider">PF</th>
                                                <th className="text-[10px] font-bold text-slate-400 pb-3 text-center uppercase tracking-wider">ESI</th>
                                                <th className="text-[10px] font-bold text-slate-400 pb-3 text-center uppercase tracking-wider">PT</th>
                                                <th className="text-[10px] font-bold text-slate-400 pb-3 text-center uppercase tracking-wider">TDS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyFilingStatus.map((row, i) => (
                                                <tr key={i} className="border-b border-slate-50 last:border-none">
                                                    <td className="py-3 text-xs font-bold text-slate-700">{row.month}</td>
                                                    {[row.pf, row.esi, row.pt, row.tds].map((s, j) => (
                                                        <td key={j} className="py-3 text-center">
                                                            <Badge className={cn("border-none font-bold text-[9px] px-2 py-0.5", statusColor(s))}>{s}</Badge>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatutoryDashboard
