"use client"

import React, { useState, useMemo } from "react"
import {
    BarChart3,
    FileSpreadsheet,
    Download,
    Calendar as CalendarIcon,
    Scale,
    Users,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    Building2,
    History,
    Activity,
    FileText,
    Clock,
    Plus,
    Edit,
    Trash2,
    Play,
    CheckCircle2,
    XCircle,
    Mail,
    MoreHorizontal,
    Wallet,
    Sparkles,
    Wand2,
    Copy,
    Pencil,
    FileBarChart,
    Layers,
    ArrowLeftRight,
    Filter,
    X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Checkbox } from "@/shared/components/ui/checkbox"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    usePayrollStore,
    calculateEmployeeNet,
    type ScheduledReport,
    type CustomReportDefinition,
    type CustomReportFilter,
} from "@/shared/data/payroll-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`
const formatINRShort = (amt: number) => {
    const abs = Math.abs(amt)
    if (abs >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`
    if (abs >= 100000) return `₹${(amt / 100000).toFixed(2)} L`
    if (abs >= 1000) return `₹${(amt / 1000).toFixed(0)}K`
    return `₹${Math.round(amt).toLocaleString("en-IN")}`
}

const emptyScheduledForm: Omit<ScheduledReport, "id"> = {
    name: "",
    reportType: "Payroll Register",
    frequency: "Monthly",
    nextRun: new Date().toISOString().split("T")[0],
    recipients: [],
    format: "Excel",
    isActive: true,
    notes: "",
}

const REPORT_TYPES: ScheduledReport["reportType"][] = [
    "Payroll Register",
    "Variance Report",
    "Bank Transfer JV",
    "YTD Statement",
    "PF Report",
    "ESI Report",
    "PT Report",
    "TDS Report",
]

// ── Custom report source → available columns ────────────────────────
type CustomSource = CustomReportDefinition["source"]

const SOURCE_COLUMNS: Record<CustomSource, { key: string; label: string; numeric?: boolean }[]> = {
    Employees: [
        { key: "empCode", label: "Emp Code" },
        { key: "name", label: "Name" },
        { key: "dept", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "basic", label: "Basic", numeric: true },
        { key: "hra", label: "HRA", numeric: true },
        { key: "specialAllowance", label: "Special Allowance", numeric: true },
        { key: "conveyance", label: "Conveyance", numeric: true },
        { key: "medicalAllowance", label: "Medical", numeric: true },
        { key: "variable", label: "Variable", numeric: true },
        { key: "pf", label: "PF", numeric: true },
        { key: "esi", label: "ESI", numeric: true },
        { key: "pt", label: "PT", numeric: true },
        { key: "tds", label: "TDS", numeric: true },
        { key: "netPay", label: "Net Pay", numeric: true },
    ],
    Claims: [
        { key: "employeeName", label: "Employee Name" },
        { key: "empCode", label: "Emp Code" },
        { key: "dept", label: "Department" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", numeric: true },
        { key: "status", label: "Status" },
        { key: "submittedDate", label: "Submitted Date" },
        { key: "approvedDate", label: "Approved Date" },
        { key: "taxable", label: "Taxable" },
    ],
    Payslips: [
        { key: "employeeName", label: "Employee Name" },
        { key: "empCode", label: "Emp Code" },
        { key: "dept", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "month", label: "Month" },
        { key: "basic", label: "Basic", numeric: true },
        { key: "hra", label: "HRA", numeric: true },
        { key: "variable", label: "Variable", numeric: true },
    ],
    Declarations: [
        { key: "employeeName", label: "Employee Name" },
        { key: "empCode", label: "Emp Code" },
        { key: "dept", label: "Department" },
        { key: "pan", label: "PAN" },
        { key: "regime", label: "Regime" },
        { key: "fiscalYear", label: "Fiscal Year" },
        { key: "status", label: "Status" },
        { key: "grossSalary", label: "Gross Salary", numeric: true },
        { key: "totalSavings", label: "Total Savings", numeric: true },
        { key: "estimatedTax", label: "Estimated Tax", numeric: true },
    ],
    PayRuns: [
        { key: "month", label: "Month" },
        { key: "status", label: "Status" },
        { key: "totalEmployees", label: "Total Employees", numeric: true },
        { key: "inclusionCount", label: "Included", numeric: true },
        { key: "exclusionCount", label: "Excluded", numeric: true },
        { key: "totalNetPay", label: "Total Net Pay", numeric: true },
        { key: "totalDeductions", label: "Total Deductions", numeric: true },
        { key: "totalTDS", label: "Total TDS", numeric: true },
        { key: "processedAt", label: "Processed At" },
    ],
}

const emptyCustomForm: Omit<CustomReportDefinition, "id"> = {
    name: "",
    source: "Employees",
    columns: ["empCode", "name", "dept", "netPay"],
    filters: [],
    sortDir: "asc",
    createdBy: "HR Admin",
    createdDate: new Date().toISOString().split("T")[0],
}

const PayrollReportsPage = () => {
    const { toast } = useToast()
    const {
        payRuns,
        payrollEmployees,
        payslips,
        claims,
        declarations,
        scheduledReports,
        addScheduledReport,
        updateScheduledReport,
        deleteScheduledReport,
        toggleScheduledReport,
        markScheduledReportRun,
        downloadHistory,
        addDownloadHistory,
        clearDownloadHistory,
        customReports,
        addCustomReport,
        updateCustomReport,
        deleteCustomReport,
        markCustomReportRun,
    } = usePayrollStore()

    // ── UI state ───────────────────────────────────────────
    const defaultRun = useMemo(() => payRuns[0], [payRuns])
    const [selectedRunId, setSelectedRunId] = useState<string>(defaultRun?.id ?? "")
    const [activeTab, setActiveTab] = useState<"statutory" | "operational" | "scheduled" | "history" | "custom">("statutory")

    // Scheduled dialogs
    const [scheduledFormOpen, setScheduledFormOpen] = useState(false)
    const [scheduledDeleteOpen, setScheduledDeleteOpen] = useState(false)
    const [editingScheduled, setEditingScheduled] = useState<ScheduledReport | null>(null)
    const [scheduledDeleteTarget, setScheduledDeleteTarget] = useState<string | null>(null)
    const [scheduledForm, setScheduledForm] = useState<Omit<ScheduledReport, "id">>(emptyScheduledForm)
    const [recipientInput, setRecipientInput] = useState("")

    // History clear confirm
    const [clearHistoryOpen, setClearHistoryOpen] = useState(false)

    // Custom report state
    const [customBuilderOpen, setCustomBuilderOpen] = useState(false)
    const [editingCustom, setEditingCustom] = useState<CustomReportDefinition | null>(null)
    const [customForm, setCustomForm] = useState<Omit<CustomReportDefinition, "id">>(emptyCustomForm)
    const [customDeleteOpen, setCustomDeleteOpen] = useState(false)
    const [customDeleteTarget, setCustomDeleteTarget] = useState<string | null>(null)
    const [customRunOpen, setCustomRunOpen] = useState(false)
    const [customRunTarget, setCustomRunTarget] = useState<CustomReportDefinition | null>(null)

    // Variance enhancement (MoM mode)
    const [varianceDialogOpen, setVarianceDialogOpen] = useState(false)
    const [varianceRunA, setVarianceRunA] = useState<string>("")
    const [varianceRunB, setVarianceRunB] = useState<string>("")

    // Pivot preview for Operational Payroll Register
    const [pivotPreviewOn, setPivotPreviewOn] = useState(false)

    // ── Active run ─────────────────────────────────────────
    const activeRun = payRuns.find((r) => r.id === selectedRunId) ?? defaultRun

    // ── Derived stats ──────────────────────────────────────
    const runStats = useMemo(() => {
        if (!activeRun) return null
        const runEmps = payrollEmployees.filter((e) => e.payRunId === activeRun.id && e.included)
        let totalPayout = 0, totalDeductions = 0, totalGross = 0, totalPF = 0, totalESI = 0, totalPT = 0, totalTDS = 0
        runEmps.forEach((e) => {
            const c = calculateEmployeeNet(e)
            totalPayout += c.netSalary
            totalDeductions += c.totalDeductions
            totalGross += c.grossEarnings
            totalPF += e.pf
            totalESI += e.esi
            totalPT += e.pt
            totalTDS += e.tds
        })
        return {
            runEmps,
            empCount: runEmps.length,
            totalPayout,
            totalDeductions,
            totalGross,
            totalPF,
            totalESI,
            totalPT,
            totalTDS,
            avgSalary: runEmps.length ? totalPayout / runEmps.length : 0,
        }
    }, [activeRun, payrollEmployees])

    // Year trend from payRuns (last 12 months)
    const yearlyTrend = useMemo(() => {
        return payRuns
            .slice()
            .reverse()
            .map((r) => {
                const runEmps = payrollEmployees.filter((e) => e.payRunId === r.id && e.included)
                let total = 0
                runEmps.forEach((e) => {
                    total += calculateEmployeeNet(e).netSalary
                })
                return { month: r.month, total, status: r.status, empCount: runEmps.length }
            })
    }, [payRuns, payrollEmployees])

    const maxTrendValue = Math.max(1, ...yearlyTrend.map((t) => t.total))
    const prevRun = useMemo(() => {
        if (!activeRun) return null
        const idx = payRuns.findIndex((r) => r.id === activeRun.id)
        return payRuns[idx + 1] ?? null
    }, [activeRun, payRuns])

    const prevRunStats = useMemo(() => {
        if (!prevRun) return null
        const runEmps = payrollEmployees.filter((e) => e.payRunId === prevRun.id && e.included)
        let totalPayout = 0
        runEmps.forEach((e) => { totalPayout += calculateEmployeeNet(e).netSalary })
        return { totalPayout }
    }, [prevRun, payrollEmployees])

    const variance = useMemo(() => {
        if (!runStats || !prevRunStats || prevRunStats.totalPayout === 0) return null
        const delta = runStats.totalPayout - prevRunStats.totalPayout
        const pct = (delta / prevRunStats.totalPayout) * 100
        return { delta, pct }
    }, [runStats, prevRunStats])

    const ytdStats = useMemo(() => {
        const currentYear = new Date().getFullYear()
        const fyRuns = payRuns.filter((r) => {
            const parts = r.month.split(" ")
            const year = parseInt(parts[1] || "0")
            return year === currentYear || year === currentYear - 1
        })
        let ytdPayout = 0, ytdPF = 0, ytdESI = 0, ytdTDS = 0, ytdEmpCount = 0
        const uniqueEmps = new Set<string>()
        fyRuns.forEach((r) => {
            const runEmps = payrollEmployees.filter((e) => e.payRunId === r.id && e.included)
            runEmps.forEach((e) => {
                const c = calculateEmployeeNet(e)
                ytdPayout += c.netSalary
                ytdPF += e.pf
                ytdESI += e.esi
                ytdTDS += e.tds
                uniqueEmps.add(e.empCode)
            })
            ytdEmpCount += runEmps.length
        })
        return { ytdPayout, ytdPF, ytdESI, ytdTDS, uniqueEmpCount: uniqueEmps.size, runsProcessed: fyRuns.filter((r) => r.status === "Paid" || r.status === "Locked").length }
    }, [payRuns, payrollEmployees])

    // ── Download helpers ────────────────────────────────────
    const downloadBlob = (content: string, filename: string, mime: string) => {
        const blob = new Blob([content], { type: mime })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const downloadCsv = (content: string, filename: string) => downloadBlob(content, filename, "text/csv;charset=utf-8;")
    const downloadHtmlAsPdf = (html: string, filename: string) => {
        // Mock PDF: blob with text/html (browser will treat as downloadable .pdf-named file)
        downloadBlob(html, filename, "text/html;charset=utf-8;")
    }

    const logDownload = (reportName: string, format: string, rowCount?: number) => {
        addDownloadHistory({
            reportName,
            format,
            month: activeRun?.month,
            downloadedBy: "HR Admin",
            rowCount,
        })
    }

    // ── Statutory report generators ──────────────────────
    const generatePFReport = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const headers = ["Emp Code", "Name", "UAN", "Basic Pay", "Employee PF (12%)", "Employer PF (12%)", "Total PF"]
        const rows = runStats.runEmps.map((e) => {
            const empPF = e.pf
            const employerPF = Math.round(e.basic * 0.12)
            return [e.empCode, `"${e.name}"`, "100" + e.empCode.slice(-10), e.basic, empPF, employerPF, empPF + employerPF].join(",")
        })
        const totalRow = ["", "", "", "", runStats.totalPF, Math.round(runStats.runEmps.reduce((s, e) => s + e.basic * 0.12, 0)), runStats.totalPF + Math.round(runStats.runEmps.reduce((s, e) => s + e.basic * 0.12, 0))].map(String).join(",")
        const csv = [headers.join(","), ...rows, "", "Totals," + totalRow].join("\n")
        downloadCsv(csv, `PF_Report_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("PF Report", "CSV", runStats.runEmps.length)
        toast({ title: "PF report downloaded", description: `${runStats.runEmps.length} rows, ${activeRun.month}.` })
    }

    const generateESIReport = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const eligible = runStats.runEmps.filter((e) => (e.basic + e.hra + e.specialAllowance + e.conveyance + e.medicalAllowance) <= 21000)
        if (!eligible.length) {
            toast({ title: "No ESI eligible employees", description: "Only employees with gross ≤ ₹21K are ESI eligible." })
            return
        }
        const headers = ["Emp Code", "Name", "ESI Number", "Gross Wage", "Employee ESI (0.75%)", "Employer ESI (3.25%)", "Total ESI"]
        const rows = eligible.map((e) => {
            const gross = e.basic + e.hra + e.specialAllowance + e.conveyance + e.medicalAllowance
            const empESI = e.esi
            const employerESI = Math.round(gross * 0.0325)
            return [e.empCode, `"${e.name}"`, "310" + e.empCode.slice(-10), gross, empESI, employerESI, empESI + employerESI].join(",")
        })
        const csv = [headers.join(","), ...rows].join("\n")
        downloadCsv(csv, `ESI_Report_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("ESI Report", "CSV", eligible.length)
        toast({ title: "ESI report downloaded", description: `${eligible.length} eligible employees.` })
    }

    const generatePTReport = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const headers = ["Emp Code", "Name", "State", "Gross Salary", "PT Deduction"]
        const rows = runStats.runEmps.map((e) => {
            const gross = e.basic + e.hra + e.specialAllowance + e.conveyance + e.medicalAllowance
            return [e.empCode, `"${e.name}"`, "Karnataka", gross, e.pt].join(",")
        })
        const totalRow = ["", "", "", "", runStats.totalPT].map(String).join(",")
        const csv = [headers.join(","), ...rows, "", "Total," + totalRow].join("\n")
        downloadCsv(csv, `PT_Report_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("PT Report", "CSV", runStats.runEmps.length)
        toast({ title: "PT report downloaded" })
    }

    const generateTDSReport = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const headers = ["Emp Code", "Name", "PAN", "Gross Salary", "TDS Deducted"]
        const rows = runStats.runEmps.map((e) => {
            const gross = e.basic + e.hra + e.specialAllowance + e.conveyance + e.medicalAllowance + e.variable
            const dec = declarations.find((d) => d.employeeId === e.empCode)
            return [e.empCode, `"${e.name}"`, dec?.pan ?? "", gross, e.tds].join(",")
        })
        const totalRow = ["", "", "", "", runStats.totalTDS].map(String).join(",")
        const csv = [headers.join(","), ...rows, "", "Total," + totalRow].join("\n")
        downloadCsv(csv, `TDS_Report_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("TDS Report", "CSV", runStats.runEmps.length)
        toast({ title: "TDS report downloaded" })
    }

    // ── Bulk PDF for Statutory (mock) ──────────────────────
    const generateBundledStatutoryPdf = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const sections = [
            { title: "Provident Fund (EPF)", amount: runStats.totalPF, note: "ECR + Monthly Return" },
            { title: "ESI Contribution", amount: runStats.totalESI, note: "Monthly Compliance" },
            { title: "Professional Tax", amount: runStats.totalPT, note: "State Liability" },
            { title: "TDS / Income Tax", amount: runStats.totalTDS, note: "Form 24Q & Quarterly" },
        ]
        const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Statutory Bundle ${activeRun.month}</title>
<style>body{font-family:Arial,sans-serif;padding:32px;color:#0f172a}
h1{color:#8B5CF6;margin:0 0 4px}h2{color:#1e293b;margin:24px 0 8px;border-bottom:2px solid #8B5CF6;padding-bottom:4px}
.hdr{margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e2e8f0}
table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #e2e8f0;padding:8px;text-align:left;font-size:12px}
th{background:#f8fafc;color:#475569;font-weight:700}
.amount{font-size:20px;font-weight:700;color:#8B5CF6}</style></head><body>
<div class="hdr"><h1>Statutory Compliance Bundle</h1>
<div>Pay Period: <strong>${activeRun.month}</strong> · Generated: ${new Date().toLocaleString("en-IN")}</div></div>
${sections.map(s => `<h2>${s.title}</h2>
<div style="font-size:11px;color:#64748b;margin-bottom:8px">${s.note}</div>
<div class="amount">${formatINR(s.amount)}</div>
<table><tr><th>Emp Code</th><th>Name</th><th>Dept</th><th>Amount</th></tr>
${runStats.runEmps.slice(0, 50).map(e => `<tr><td>${e.empCode}</td><td>${e.name}</td><td>${e.dept}</td><td>${formatINR(
            s.title.includes("PF") ? e.pf : s.title.includes("ESI") ? e.esi : s.title.includes("Professional") ? e.pt : e.tds
        )}</td></tr>`).join("")}
</table>`).join("")}
</body></html>`
        downloadHtmlAsPdf(html, `Statutory_Bundle_${activeRun.month.replace(/\s+/g, "_")}.pdf`)
        logDownload("Statutory Bundle (PDF)", "PDF", sections.length)
        toast({ title: "4 reports bundled", description: `Combined statutory PDF for ${activeRun.month}.` })
    }

    // ── Operational report generators ────────────────────
    const generatePayrollRegister = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const headers = [
            "Emp Code", "Name", "Dept", "Designation",
            "Basic", "HRA", "Special Allowance", "Conveyance", "Medical", "Variable", "OT Amount",
            "Gross Earnings", "LOP Deduction", "PF", "ESI", "PT", "TDS", "Other Deductions", "Total Deductions",
            "Net Salary", "Bank Account", "IFSC",
        ]
        const rows = runStats.runEmps.map((e) => {
            const c = calculateEmployeeNet(e)
            return [
                e.empCode, `"${e.name}"`, e.dept, `"${e.designation}"`,
                e.basic, e.hra, e.specialAllowance, e.conveyance, e.medicalAllowance, e.variable, Math.round(c.otAmount),
                Math.round(c.grossEarnings), Math.round(c.lopDeduction), e.pf, e.esi, e.pt, e.tds, e.otherDeductions, Math.round(c.totalDeductions),
                Math.round(c.netSalary), e.bankAccount ?? "", e.ifsc ?? "",
            ].join(",")
        })
        const totals = runStats
        const totalRow = ["", "", "", "",
            totals.runEmps.reduce((s, e) => s + e.basic, 0),
            totals.runEmps.reduce((s, e) => s + e.hra, 0),
            totals.runEmps.reduce((s, e) => s + e.specialAllowance, 0),
            totals.runEmps.reduce((s, e) => s + e.conveyance, 0),
            totals.runEmps.reduce((s, e) => s + e.medicalAllowance, 0),
            totals.runEmps.reduce((s, e) => s + e.variable, 0),
            "", Math.round(totals.totalGross), "",
            totals.totalPF, totals.totalESI, totals.totalPT, totals.totalTDS,
            totals.runEmps.reduce((s, e) => s + e.otherDeductions, 0),
            Math.round(totals.totalDeductions), Math.round(totals.totalPayout), "", ""].map(String).join(",")
        const csv = [headers.join(","), ...rows, "", "Totals," + totalRow].join("\n")
        downloadCsv(csv, `Payroll_Register_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("Payroll Register", "CSV", runStats.runEmps.length)
        toast({ title: "Payroll register downloaded", description: `${runStats.runEmps.length} rows + totals.` })
    }

    const generateVarianceReport = () => {
        if (!activeRun || !prevRun) {
            toast({ title: "Cannot generate variance", description: "Need at least 2 pay runs to compare.", variant: "destructive" })
            return
        }
        const curEmps = payrollEmployees.filter((e) => e.payRunId === activeRun.id && e.included)
        const prevEmps = payrollEmployees.filter((e) => e.payRunId === prevRun.id && e.included)
        const allCodes = Array.from(new Set([...curEmps.map((e) => e.empCode), ...prevEmps.map((e) => e.empCode)]))

        const headers = ["Emp Code", "Name", "Prev Net", "Current Net", "Delta", "Delta %"]
        const rows = allCodes.map((code) => {
            const cur = curEmps.find((e) => e.empCode === code)
            const prev = prevEmps.find((e) => e.empCode === code)
            const curNet = cur ? calculateEmployeeNet(cur).netSalary : 0
            const prevNet = prev ? calculateEmployeeNet(prev).netSalary : 0
            const delta = curNet - prevNet
            const pct = prevNet ? ((delta / prevNet) * 100).toFixed(2) : "NEW"
            return [code, `"${cur?.name ?? prev?.name ?? "—"}"`, Math.round(prevNet), Math.round(curNet), Math.round(delta), pct].join(",")
        })
        const csv = [`Variance ${prevRun.month} vs ${activeRun.month}`, "", headers.join(","), ...rows].join("\n")
        downloadCsv(csv, `Variance_Report_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("Variance Report", "CSV", allCodes.length)
        toast({ title: "Variance report downloaded", description: `${prevRun.month} vs ${activeRun.month}.` })
    }

    const generateBankTransferJV = () => {
        if (!runStats || !activeRun) { toast({ title: "No data", variant: "destructive" }); return }
        const headers = ["Emp Code", "Name", "Bank Account", "IFSC", "Net Amount (INR)", "Transfer Type", "Remark"]
        const rows = runStats.runEmps.map((e) => {
            const net = Math.round(calculateEmployeeNet(e).netSalary)
            const type = net >= 200000 ? "RTGS" : "NEFT"
            return [e.empCode, `"${e.name}"`, e.bankAccount ?? "NOT_PROVIDED", e.ifsc ?? "NOT_PROVIDED", net, type, `Salary ${activeRun.month}`].join(",")
        })
        const total = runStats.runEmps.reduce((s, e) => s + Math.round(calculateEmployeeNet(e).netSalary), 0)
        const csv = [`Bank Transfer JV - ${activeRun.month}`, `Total Disbursement,${total}`, "", headers.join(","), ...rows].join("\n")
        downloadCsv(csv, `Bank_Transfer_JV_${activeRun.month.replace(/\s+/g, "_")}.csv`)
        logDownload("Bank Transfer JV", "CSV", runStats.runEmps.length)
        toast({ title: "Bank JV downloaded", description: `${runStats.runEmps.length} transfers.` })
    }

    const generateYTDStatement = () => {
        const headers = ["Emp Code", "Name", "Total Earnings (YTD)", "Total Deductions (YTD)", "Total PF", "Total ESI", "Total TDS", "Net Paid (YTD)"]
        const empMap = new Map<string, any>()
        payRuns.filter((r) => r.status === "Paid" || r.status === "Locked").forEach((r) => {
            const runEmps = payrollEmployees.filter((e) => e.payRunId === r.id && e.included)
            runEmps.forEach((e) => {
                const c = calculateEmployeeNet(e)
                const existing = empMap.get(e.empCode) ?? { code: e.empCode, name: e.name, gross: 0, deductions: 0, pf: 0, esi: 0, tds: 0, net: 0 }
                existing.gross += c.grossEarnings
                existing.deductions += c.totalDeductions
                existing.pf += e.pf
                existing.esi += e.esi
                existing.tds += e.tds
                existing.net += c.netSalary
                empMap.set(e.empCode, existing)
            })
        })
        if (empMap.size === 0) {
            toast({ title: "No paid runs yet", description: "YTD report needs at least one paid run.", variant: "destructive" })
            return
        }
        const rows = Array.from(empMap.values()).map((x) =>
            [x.code, `"${x.name}"`, Math.round(x.gross), Math.round(x.deductions), x.pf, x.esi, x.tds, Math.round(x.net)].join(",")
        )
        const csv = [`YTD Statement — ${new Date().getFullYear()}`, "", headers.join(","), ...rows].join("\n")
        downloadCsv(csv, `YTD_Statement_${new Date().getFullYear()}.csv`)
        logDownload("YTD Statement", "CSV", empMap.size)
        toast({ title: "YTD statement downloaded", description: `${empMap.size} employees.` })
    }

    // ── Batch export ────────────────────────────────────
    const handleBatchExport = () => {
        if (!activeRun) return
        toast({ title: "Generating batch...", description: "All monthly reports." })
        generatePayrollRegister()
        generatePFReport()
        generateESIReport()
        generatePTReport()
        generateTDSReport()
        generateBankTransferJV()
        if (prevRun) generateVarianceReport()
        toast({ title: "Batch download complete", description: "6+ files downloaded." })
    }

    // ── Scheduled handlers ──────────────────────────────
    const openAddScheduled = () => {
        setEditingScheduled(null)
        setScheduledForm(emptyScheduledForm)
        setRecipientInput("")
        setScheduledFormOpen(true)
    }

    const openEditScheduled = (s: ScheduledReport) => {
        setEditingScheduled(s)
        setScheduledForm({
            name: s.name,
            reportType: s.reportType,
            frequency: s.frequency,
            nextRun: s.nextRun,
            recipients: [...s.recipients],
            format: s.format,
            isActive: s.isActive,
            lastRun: s.lastRun,
            lastRunStatus: s.lastRunStatus,
            notes: s.notes ?? "",
        })
        setRecipientInput("")
        setScheduledFormOpen(true)
    }

    const handleAddRecipient = () => {
        const email = recipientInput.trim()
        if (!email) return
        if (!email.includes("@")) {
            toast({ title: "Invalid email", variant: "destructive" })
            return
        }
        if (scheduledForm.recipients.includes(email)) {
            toast({ title: "Already added", variant: "destructive" })
            return
        }
        setScheduledForm({ ...scheduledForm, recipients: [...scheduledForm.recipients, email] })
        setRecipientInput("")
    }

    const handleRemoveRecipient = (email: string) => {
        setScheduledForm({ ...scheduledForm, recipients: scheduledForm.recipients.filter((e) => e !== email) })
    }

    const handleSaveScheduled = () => {
        if (!scheduledForm.name.trim()) {
            toast({ title: "Name required", variant: "destructive" })
            return
        }
        if (scheduledForm.recipients.length === 0) {
            toast({ title: "At least one recipient required", variant: "destructive" })
            return
        }
        if (editingScheduled) {
            updateScheduledReport(editingScheduled.id, scheduledForm)
            toast({ title: "Schedule updated", description: scheduledForm.name })
        } else {
            addScheduledReport(scheduledForm)
            toast({ title: "Schedule created", description: scheduledForm.name })
        }
        setScheduledFormOpen(false)
        setEditingScheduled(null)
    }

    const handleDeleteScheduled = () => {
        if (!scheduledDeleteTarget) return
        const s = scheduledReports.find((x) => x.id === scheduledDeleteTarget)
        deleteScheduledReport(scheduledDeleteTarget)
        toast({ title: "Schedule deleted", description: s?.name ?? "", variant: "destructive" })
        setScheduledDeleteOpen(false)
        setScheduledDeleteTarget(null)
    }

    const handleRunNow = (s: ScheduledReport) => {
        try {
            switch (s.reportType) {
                case "Payroll Register": generatePayrollRegister(); break
                case "Variance Report": generateVarianceReport(); break
                case "Bank Transfer JV": generateBankTransferJV(); break
                case "YTD Statement": generateYTDStatement(); break
                case "PF Report": generatePFReport(); break
                case "ESI Report": generateESIReport(); break
                case "PT Report": generatePTReport(); break
                case "TDS Report": generateTDSReport(); break
            }
            markScheduledReportRun(s.id, "Success")
            toast({
                title: "Report run triggered",
                description: `Recipients would receive an email (${s.recipients.length}). File downloaded locally.`,
            })
        } catch {
            markScheduledReportRun(s.id, "Failed")
            toast({ title: "Run failed", variant: "destructive" })
        }
    }

    // ── History handlers ────────────────────────────────
    const handleClearHistory = () => {
        clearDownloadHistory()
        toast({ title: "Download history cleared", variant: "destructive" })
        setClearHistoryOpen(false)
    }

    const handleExportHistory = () => {
        if (!downloadHistory.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Timestamp", "Report", "Format", "Month", "Downloaded By", "Row Count"]
        const rows = downloadHistory.map((h) => [
            new Date(h.timestamp).toISOString(),
            `"${h.reportName}"`,
            h.format,
            h.month ?? "",
            h.downloadedBy,
            h.rowCount ?? "",
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        downloadCsv(csv, `download_history_${new Date().toISOString().split("T")[0]}.csv`)
        toast({ title: "History exported" })
    }

    // ── Custom reports handlers ──────────────────────────
    const openAddCustom = () => {
        setEditingCustom(null)
        setCustomForm({ ...emptyCustomForm, createdDate: new Date().toISOString().split("T")[0] })
        setCustomBuilderOpen(true)
    }

    const openEditCustom = (r: CustomReportDefinition) => {
        setEditingCustom(r)
        setCustomForm({
            name: r.name,
            source: r.source,
            columns: [...r.columns],
            filters: r.filters.map((f) => ({ ...f })),
            groupBy: r.groupBy,
            sortBy: r.sortBy,
            sortDir: r.sortDir ?? "asc",
            pivotField: r.pivotField,
            createdBy: r.createdBy,
            createdDate: r.createdDate,
            lastRunDate: r.lastRunDate,
        })
        setCustomBuilderOpen(true)
    }

    const handleSaveCustom = () => {
        if (!customForm.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return }
        if (customForm.columns.length === 0) { toast({ title: "Pick at least one column", variant: "destructive" }); return }
        if (editingCustom) {
            updateCustomReport(editingCustom.id, customForm)
            toast({ title: "Custom report updated", description: customForm.name })
        } else {
            addCustomReport(customForm)
            toast({ title: "Custom report created", description: customForm.name })
        }
        setCustomBuilderOpen(false)
        setEditingCustom(null)
    }

    const handleDuplicateCustom = (r: CustomReportDefinition) => {
        const { id, ...rest } = r
        addCustomReport({
            ...rest,
            name: `${r.name} (copy)`,
            createdDate: new Date().toISOString().split("T")[0],
            lastRunDate: undefined,
        })
        toast({ title: "Report duplicated", description: `${r.name} (copy)` })
    }

    const handleDeleteCustom = () => {
        if (!customDeleteTarget) return
        const r = customReports.find((x) => x.id === customDeleteTarget)
        deleteCustomReport(customDeleteTarget)
        toast({ title: "Report deleted", description: r?.name ?? "", variant: "destructive" })
        setCustomDeleteOpen(false)
        setCustomDeleteTarget(null)
    }

    const openRunCustom = (r: CustomReportDefinition) => {
        setCustomRunTarget(r)
        setCustomRunOpen(true)
        markCustomReportRun(r.id)
    }

    // ── Custom report execution helpers ─────────────────
    const buildEnrichedEmployees = () => {
        return payrollEmployees.map((e) => {
            const c = calculateEmployeeNet(e)
            return { ...e, netPay: Math.round(c.netSalary) }
        })
    }

    const getSourceRows = (source: CustomSource): any[] => {
        switch (source) {
            case "Employees": return buildEnrichedEmployees()
            case "Claims": return claims
            case "Payslips": return payslips
            case "Declarations": return declarations
            case "PayRuns": return payRuns
        }
    }

    const applyFilter = (val: any, f: CustomReportFilter): boolean => {
        const fv = f.value
        if (val === undefined || val === null) return f.op === "ne"
        switch (f.op) {
            case "eq": return String(val) === fv
            case "ne": return String(val) !== fv
            case "gt": return Number(val) > Number(fv)
            case "lt": return Number(val) < Number(fv)
            case "contains": return String(val).toLowerCase().includes(fv.toLowerCase())
            default: return true
        }
    }

    const executeReport = (def: CustomReportDefinition) => {
        let rows = getSourceRows(def.source)
        def.filters.forEach((f) => {
            rows = rows.filter((r) => applyFilter(r[f.field], f))
        })
        if (def.sortBy) {
            const dir = def.sortDir === "desc" ? -1 : 1
            rows = rows.slice().sort((a, b) => {
                const av = a[def.sortBy!]
                const bv = b[def.sortBy!]
                if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir
                return String(av ?? "").localeCompare(String(bv ?? "")) * dir
            })
        }
        return rows
    }

    const exportCustomCsv = (def: CustomReportDefinition) => {
        const rows = executeReport(def)
        const header = def.columns.join(",")
        const body = rows.map((r) =>
            def.columns.map((c) => {
                const v = r[c] ?? ""
                const s = typeof v === "string" && v.includes(",") ? `"${v.replace(/"/g, '""')}"` : String(v)
                return s
            }).join(",")
        )
        const csv = [header, ...body].join("\n")
        downloadCsv(csv, `${def.name.replace(/\s+/g, "_")}.csv`)
        logDownload(def.name, "CSV", rows.length)
        toast({ title: "CSV exported", description: `${rows.length} rows.` })
    }

    const exportCustomPdf = (def: CustomReportDefinition) => {
        const rows = executeReport(def)
        const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${def.name}</title>
<style>body{font-family:Arial,sans-serif;padding:32px;color:#0f172a}
h1{color:#8B5CF6;margin:0 0 4px}
.hdr{margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e2e8f0}
table{width:100%;border-collapse:collapse;margin-top:8px}
th,td{border:1px solid #e2e8f0;padding:8px;text-align:left;font-size:12px}
th{background:#f8fafc;color:#475569;font-weight:700}</style></head><body>
<div class="hdr"><h1>${def.name}</h1>
<div>Source: <strong>${def.source}</strong> · Generated: ${new Date().toLocaleString("en-IN")} · Rows: <strong>${rows.length}</strong></div></div>
<table><tr>${def.columns.map(c => `<th>${c}</th>`).join("")}</tr>
${rows.map(r => `<tr>${def.columns.map(c => `<td>${r[c] ?? ""}</td>`).join("")}</tr>`).join("")}
</table></body></html>`
        downloadHtmlAsPdf(html, `${def.name.replace(/\s+/g, "_")}.pdf`)
        logDownload(def.name, "PDF", rows.length)
        toast({ title: "PDF exported (mock)", description: `${rows.length} rows.` })
    }

    // ── Variance MoM dialog handlers ─────────────────────
    const openVarianceDialog = () => {
        setVarianceRunA(activeRun?.id ?? "")
        setVarianceRunB(prevRun?.id ?? "")
        setVarianceDialogOpen(true)
    }

    const varianceMoM = useMemo(() => {
        if (!varianceRunA || !varianceRunB) return null
        const a = payRuns.find((r) => r.id === varianceRunA)
        const b = payRuns.find((r) => r.id === varianceRunB)
        if (!a || !b) return null
        const aEmps = payrollEmployees.filter((e) => e.payRunId === a.id && e.included)
        const bEmps = payrollEmployees.filter((e) => e.payRunId === b.id && e.included)
        const roll = (list: typeof aEmps) => {
            let gross = 0, net = 0, pf = 0, esi = 0, pt = 0, tds = 0, ded = 0
            list.forEach((e) => {
                const c = calculateEmployeeNet(e)
                gross += c.grossEarnings
                net += c.netSalary
                ded += c.totalDeductions
                pf += e.pf; esi += e.esi; pt += e.pt; tds += e.tds
            })
            return { gross, net, pf, esi, pt, tds, ded, count: list.length }
        }
        return { a, b, aRoll: roll(aEmps), bRoll: roll(bEmps) }
    }, [varianceRunA, varianceRunB, payRuns, payrollEmployees])

    // ── Pivot view for Payroll Register (department × component) ────
    const registerPivot = useMemo(() => {
        if (!runStats) return null
        const deptMap = new Map<string, { dept: string; basic: number; hra: number; specialAllowance: number; variable: number; pf: number; esi: number; pt: number; tds: number; netPay: number; count: number }>()
        runStats.runEmps.forEach((e) => {
            const d = deptMap.get(e.dept) ?? { dept: e.dept, basic: 0, hra: 0, specialAllowance: 0, variable: 0, pf: 0, esi: 0, pt: 0, tds: 0, netPay: 0, count: 0 }
            d.basic += e.basic
            d.hra += e.hra
            d.specialAllowance += e.specialAllowance
            d.variable += e.variable
            d.pf += e.pf
            d.esi += e.esi
            d.pt += e.pt
            d.tds += e.tds
            d.netPay += calculateEmployeeNet(e).netSalary
            d.count += 1
            deptMap.set(e.dept, d)
        })
        return Array.from(deptMap.values())
    }, [runStats])

    // ── Statutory report cards data (live) ──────────────
    const statutoryCards = useMemo(() => {
        if (!runStats) return []
        return [
            { id: "PF", name: "Provident Fund (EPF)", desc: "ECR + Monthly Return", amount: runStats.totalPF, color: "#8B5CF6", onDownload: generatePFReport },
            { id: "ESI", name: "ESI Contribution", desc: "Monthly Compliance", amount: runStats.totalESI, color: "#EC4899", onDownload: generateESIReport },
            { id: "PT", name: "Professional Tax", desc: "State Liability", amount: runStats.totalPT, color: "#F59E0B", onDownload: generatePTReport },
            { id: "TDS", name: "TDS / Income Tax", desc: "Form 24Q & Quarterly", amount: runStats.totalTDS, color: "#10B981", onDownload: generateTDSReport },
        ]
    }, [runStats])

    const operationalCards = [
        { name: "Payroll Register", desc: "Per-employee full breakdown with totals", icon: FileSpreadsheet, onDownload: generatePayrollRegister },
        { name: "Variance Report", desc: "MoM net salary delta per employee", icon: Scale, onDownload: generateVarianceReport, disabled: !prevRun },
        { name: "Bank Transfer JV", desc: "NEFT/RTGS auto-classified by amount", icon: Building2, onDownload: generateBankTransferJV },
        { name: "YTD Statement", desc: "Cumulative earnings + deductions YTD", icon: History, onDownload: generateYTDStatement },
    ]

    if (!activeRun) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] p-8 font-sans">
                <div className="h-16 w-16 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center text-[#8B5CF6] mb-4">
                    <BarChart3 size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No pay run available</h2>
                <p className="text-sm text-slate-500">Run a payroll cycle first to generate reports.</p>
            </div>
        )
    }

    const availableColumns = SOURCE_COLUMNS[customForm.source]
    const runTargetRows = customRunTarget ? executeReport(customRunTarget) : []
    const runTargetGrouped = customRunTarget?.groupBy
        ? groupRows(runTargetRows, customRunTarget.groupBy)
        : null
    const runTargetPivot = customRunTarget?.pivotField && customRunTarget?.groupBy
        ? pivotRows(runTargetRows, customRunTarget.groupBy, customRunTarget.pivotField, SOURCE_COLUMNS[customRunTarget.source])
        : null

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <BarChart3 size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Payroll Reports</h1>
                            <p className="text-xs font-medium text-slate-500">Statutory & operational reports derived from live data</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={selectedRunId} onValueChange={setSelectedRunId}>
                            <SelectTrigger className="h-9 w-40 rounded-lg border-slate-200 bg-white font-semibold text-xs">
                                <CalendarIcon size={13} className="mr-1 text-[#8B5CF6]" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {payRuns.map((r) => (
                                    <SelectItem key={r.id} value={r.id}>
                                        <div className="flex items-center gap-2">
                                            <span>{r.month}</span>
                                            <Badge className={cn("border-none text-[9px] font-bold",
                                                r.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                                                    r.status === "Locked" ? "bg-emerald-50 text-emerald-600" :
                                                        r.status === "Draft" ? "bg-slate-100 text-slate-600" :
                                                            "bg-blue-50 text-blue-600")}>
                                                {r.status}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleBatchExport}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Batch export</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1 min-w-0">
                                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total disbursement</p>
                                            <p className="text-xl font-bold text-slate-900 tracking-tight tabular-nums truncate">{formatINRShort(runStats?.totalPayout ?? 0)}</p>
                                            {variance && (
                                                <div className={cn("flex items-center gap-1 text-[11px] font-bold", variance.delta >= 0 ? "text-emerald-600" : "text-rose-600")}>
                                                    {variance.delta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                                    {variance.pct >= 0 ? "+" : ""}{variance.pct.toFixed(1)}% vs {prevRun?.month}
                                                </div>
                                            )}
                                        </div>
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-[#8B5CF6]/10 text-[#8B5CF6]">
                                            <Wallet size={18} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <StatCard label="Employees" value={String(runStats?.empCount ?? 0)} caption="Included in cycle" icon={Users} color="#0EA5E9" />
                            <StatCard label="Avg salary" value={formatINRShort(runStats?.avgSalary ?? 0)} caption="Per employee" icon={Activity} color="#10B981" />
                            <StatCard
                                label="YTD payout"
                                value={formatINRShort(ytdStats.ytdPayout)}
                                caption={`${ytdStats.runsProcessed} runs, ${ytdStats.uniqueEmpCount} emps`}
                                icon={TrendingUp}
                                color="#F59E0B"
                            />
                        </div>

                        {/* Year trend chart */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 space-y-0">
                                <CardTitle className="text-base font-bold text-slate-900">Disbursement trend</CardTitle>
                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                    Last {yearlyTrend.length} pay runs · click a bar to switch the selected cycle
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 lg:p-5">
                                <div className="flex items-end gap-3 h-52 pt-6 relative">
                                    {yearlyTrend.length === 0 ? (
                                        <div className="w-full text-center text-sm font-medium text-slate-400">No pay run data to display.</div>
                                    ) : (
                                        yearlyTrend.map((t, i) => {
                                            const run = payRuns.find((r) => r.month === t.month)
                                            const isSelected = run?.id === activeRun.id
                                            const heightPct = maxTrendValue ? (t.total / maxTrendValue) * 100 : 0
                                            return (
                                                <Tooltip key={t.month + i}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            onClick={() => run && setSelectedRunId(run.id)}
                                                            className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                                                        >
                                                            <span className={cn("text-[10px] font-bold tabular-nums",
                                                                isSelected ? "text-[#8B5CF6]" : "text-slate-400 group-hover:text-slate-600")}>
                                                                {formatINRShort(t.total)}
                                                            </span>
                                                            <div className="w-full relative flex-1 flex items-end">
                                                                <motion.div
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${heightPct}%` }}
                                                                    transition={{ duration: 0.8, delay: i * 0.04 }}
                                                                    className={cn("w-full rounded-t-lg transition-all",
                                                                        isSelected ? "bg-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/30" :
                                                                            t.status === "Paid" ? "bg-emerald-300 hover:bg-emerald-400" :
                                                                                t.status === "Draft" ? "bg-slate-200 hover:bg-slate-300" :
                                                                                    "bg-blue-300 hover:bg-blue-400")}
                                                                />
                                                            </div>
                                                            <span className={cn("text-[10px] font-semibold uppercase tracking-wider",
                                                                isSelected ? "text-[#8B5CF6]" : "text-slate-500")}>
                                                                {t.month.split(" ")[0].slice(0, 3)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-xs">
                                                            <div className="font-bold">{t.month}</div>
                                                            <div className="text-slate-500">{formatINR(t.total)} • {t.empCount} employees</div>
                                                            <div className="text-slate-500">Status: {t.status}</div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                            <TabsList className="bg-slate-100 p-1 rounded-xl h-11 flex-wrap">
                                <TabsTrigger value="statutory" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <ShieldCheck size={13} /> Statutory
                                </TabsTrigger>
                                <TabsTrigger value="operational" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <FileSpreadsheet size={13} /> Operational
                                </TabsTrigger>
                                <TabsTrigger value="custom" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Sparkles size={13} /> Custom ({customReports.length})
                                </TabsTrigger>
                                <TabsTrigger value="scheduled" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Clock size={13} /> Scheduled ({scheduledReports.filter((s) => s.isActive).length})
                                </TabsTrigger>
                                <TabsTrigger value="history" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <History size={13} /> History ({downloadHistory.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* ── Statutory ─────────────── */}
                            <TabsContent value="statutory" className="mt-5 space-y-4">
                                <div className="flex justify-end">
                                    <Button
                                        onClick={generateBundledStatutoryPdf}
                                        variant="outline"
                                        className="h-9 rounded-lg border-[#8B5CF6]/30 text-[#8B5CF6] font-semibold text-xs gap-2 hover:bg-[#8B5CF6]/5"
                                    >
                                        <FileBarChart size={13} /> Export all (PDF)
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {statutoryCards.map((c) => (
                                        <Card key={c.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}14`, color: c.color }}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold px-2">Live data</Badge>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{c.desc}</p>
                                                </div>
                                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liability</div>
                                                        <div className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">{formatINR(c.amount)}</div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={c.onDownload}
                                                        className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-1 px-3"
                                                    >
                                                        <Download size={12} /> CSV
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* ── Operational ──────────────── */}
                            <TabsContent value="operational" className="mt-5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {operationalCards.map((c) => (
                                        <Card key={c.name} className={cn("rounded-2xl border shadow-sm transition-all",
                                            c.disabled ? "border-slate-100 bg-slate-50/60 opacity-70" : "border-slate-200 bg-white hover:shadow-md")}>
                                            <CardContent className="p-5 flex items-center gap-4">
                                                <div className="h-14 w-14 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                    <c.icon size={24} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">{c.desc}</p>
                                                    {c.disabled && <p className="text-[10px] font-medium text-amber-600 mt-1 italic">Need 2+ pay runs to compare</p>}
                                                </div>
                                                <Button
                                                    onClick={c.onDownload}
                                                    disabled={c.disabled}
                                                    className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-1 px-3 disabled:opacity-50"
                                                >
                                                    <Download size={12} /> Download
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Variance MoM enhancement */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                                                <ArrowLeftRight size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-slate-900">Month-over-Month variance</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                    Compare any two pay runs side-by-side with component-level deltas.
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={openVarianceDialog}
                                            disabled={payRuns.length < 2}
                                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2 disabled:opacity-50"
                                        >
                                            <ArrowLeftRight size={13} /> Compare runs
                                        </Button>
                                    </CardHeader>
                                </Card>

                                {/* Pivot preview toggle for Payroll Register */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                                <Layers size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-slate-900">Pivot view · Department × Components</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                    Aggregated roll-up of the current payroll register by department.
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                            <Label className="text-[11px] font-bold text-slate-700">Show pivot</Label>
                                            <Switch checked={pivotPreviewOn} onCheckedChange={setPivotPreviewOn} className="data-[state=checked]:bg-[#8B5CF6]" />
                                        </div>
                                    </CardHeader>
                                    {pivotPreviewOn && registerPivot && (
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/70">
                                                        <TableRow className="border-slate-100 hover:bg-transparent">
                                                            <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Department</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Emps</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Basic</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">HRA</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Special</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Variable</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">PF</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">ESI</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">PT</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">TDS</TableHead>
                                                            <TableHead className="pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Net</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {registerPivot.map((d) => (
                                                            <TableRow key={d.dept} className="border-slate-50 hover:bg-slate-50/70">
                                                                <TableCell className="pl-6 py-3 text-sm font-semibold text-slate-900">{d.dept}</TableCell>
                                                                <TableCell className="py-3 text-xs font-semibold text-slate-700 text-right tabular-nums">{d.count}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.basic)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.hra)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.specialAllowance)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.variable)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.pf)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.esi)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.pt)}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">{formatINRShort(d.tds)}</TableCell>
                                                                <TableCell className="pr-6 py-3 text-xs font-bold text-[#8B5CF6] text-right tabular-nums">{formatINRShort(d.netPay)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            </TabsContent>

                            {/* ── Custom Reports ─────────── */}
                            <TabsContent value="custom" className="mt-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                                <Sparkles size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-slate-900">Custom reports</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                    Build ad-hoc reports from live payroll data. Filters, grouping, pivots.
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={openAddCustom}
                                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                                        >
                                            <Plus size={14} /> New custom report
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        {customReports.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No custom reports yet. Click "New custom report" to build one.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                {customReports.map((r) => (
                                                    <Card key={r.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
                                                        <CardContent className="p-5 space-y-4">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                                    <Wand2 size={18} />
                                                                </div>
                                                                <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold px-2">{r.source}</Badge>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-900 truncate">{r.name}</h4>
                                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                    <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-semibold gap-1 px-1.5">
                                                                        <FileText size={10} /> {r.columns.length} cols
                                                                    </Badge>
                                                                    <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-semibold gap-1 px-1.5">
                                                                        <Filter size={10} /> {r.filters.length} filters
                                                                    </Badge>
                                                                    {r.groupBy && (
                                                                        <Badge className="bg-amber-50 text-amber-600 border-none text-[10px] font-semibold gap-1 px-1.5">
                                                                            <Layers size={10} /> {r.groupBy}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-[11px] font-medium text-slate-500 mt-2">
                                                                    Last run: <span className="font-semibold">{r.lastRunDate ? new Date(r.lastRunDate).toLocaleDateString("en-IN") : "Never"}</span>
                                                                </p>
                                                            </div>
                                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => openRunCustom(r)}
                                                                    className="h-8 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-1 px-3"
                                                                >
                                                                    <Play size={12} /> Run
                                                                </Button>
                                                                <div className="flex items-center gap-1">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="sm" onClick={() => openEditCustom(r)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                <Pencil size={13} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Edit</TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="sm" onClick={() => handleDuplicateCustom(r)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100">
                                                                                <Copy size={13} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Duplicate</TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="sm" onClick={() => { setCustomDeleteTarget(r.id); setCustomDeleteOpen(true) }} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                                                                <Trash2 size={13} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Delete</TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Scheduled ─────────────── */}
                            <TabsContent value="scheduled" className="mt-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Scheduled reports</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Auto-generated reports sent to recipients on a recurring schedule.
                                            </CardDescription>
                                        </div>
                                        <Button
                                            onClick={openAddScheduled}
                                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                                        >
                                            <Plus size={14} /> Add schedule
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {scheduledReports.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No scheduled reports yet.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/70">
                                                        <TableRow className="border-slate-100 hover:bg-transparent">
                                                            <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Report</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Frequency</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Recipients</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Next run</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Last run</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                            <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {scheduledReports.map((s) => (
                                                            <TableRow key={s.id} className="border-slate-50 hover:bg-slate-50/70">
                                                                <TableCell className="pl-6 py-3">
                                                                    <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                                                                    {s.notes && <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate max-w-[280px]">{s.notes}</div>}
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <Badge className="bg-slate-100 text-slate-700 border-none text-[10px] font-semibold">{s.reportType}</Badge>
                                                                </TableCell>
                                                                <TableCell className="py-3 text-xs font-semibold text-slate-700">{s.frequency}</TableCell>
                                                                <TableCell className="py-3">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-semibold gap-1 cursor-help">
                                                                                <Mail size={10} /> {s.recipients.length}
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <div className="text-xs max-w-[250px]">
                                                                                {s.recipients.join(", ")}
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell className="py-3 text-[11px] font-medium text-slate-600">{s.nextRun}</TableCell>
                                                                <TableCell className="py-3">
                                                                    {s.lastRun ? (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[11px] font-medium text-slate-600">{s.lastRun}</span>
                                                                            {s.lastRunStatus === "Success" ? (
                                                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                                            ) : (
                                                                                <XCircle size={12} className="text-rose-500" />
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-[11px] font-medium text-slate-400">Never</span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <Switch
                                                                        checked={s.isActive}
                                                                        onCheckedChange={() => toggleScheduledReport(s.id)}
                                                                        className="data-[state=checked]:bg-[#8B5CF6]"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="text-right pr-6 py-3">
                                                                    <div className="flex justify-end gap-1">
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleRunNow(s)}
                                                                                    className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                                                >
                                                                                    <Play size={13} />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Run now</TooltipContent>
                                                                        </Tooltip>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                    <MoreHorizontal size={15} />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-40">
                                                                                <DropdownMenuItem onClick={() => openEditScheduled(s)} className="cursor-pointer text-xs font-medium">
                                                                                    <Edit size={13} className="mr-2" /> Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => handleRunNow(s)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                    <Play size={13} className="mr-2" /> Run now
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem
                                                                                    onClick={() => { setScheduledDeleteTarget(s.id); setScheduledDeleteOpen(true) }}
                                                                                    className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600"
                                                                                >
                                                                                    <Trash2 size={13} className="mr-2" /> Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── History ─────────────── */}
                            <TabsContent value="history" className="mt-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Download history</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Last 200 report downloads. Tracks what was generated and by whom.
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={handleExportHistory}
                                                className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-2 px-3"
                                            >
                                                <Download size={13} /> Export
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setClearHistoryOpen(true)}
                                                disabled={!downloadHistory.length}
                                                className="h-9 rounded-lg border-rose-200 text-rose-600 font-semibold text-xs gap-2 px-3 hover:bg-rose-50 disabled:opacity-50"
                                            >
                                                <Trash2 size={13} /> Clear
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ScrollArea className="h-[500px]">
                                            {downloadHistory.length === 0 ? (
                                                <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                    No downloads yet. Click any report's Download button to generate entries here.
                                                </div>
                                            ) : (
                                                <div className="p-3 space-y-1.5">
                                                    {downloadHistory.map((h) => (
                                                        <div key={h.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/60 border border-slate-100 hover:bg-slate-50">
                                                            <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0">
                                                                <FileText size={14} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-xs font-bold text-slate-800">{h.reportName}</span>
                                                                    <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-bold px-1.5">{h.format}</Badge>
                                                                    {h.month && <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-bold px-1.5">{h.month}</Badge>}
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-1 text-[10px] font-medium text-slate-500">
                                                                    <span>{new Date(h.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                                                                    <span>• {h.downloadedBy}</span>
                                                                    {h.rowCount !== undefined && <span>• {h.rowCount} rows</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Scheduled Form Sheet */}
                <SideFormSheet
                    open={scheduledFormOpen}
                    onOpenChange={setScheduledFormOpen}
                    title={editingScheduled ? "Edit scheduled report" : "Schedule a report"}
                    description="Auto-generated and emailed to recipients on schedule."
                    icon={editingScheduled ? <Edit size={20} /> : <CalendarIcon size={20} />}
                    accentColor={editingScheduled ? "#7c3aed" : "#4f46e5"}
                    width="lg"
                    submitLabel={editingScheduled ? "Save" : "Schedule report"}
                    onSubmit={(e) => { e.preventDefault(); handleSaveScheduled(); }}
                >
                    <div className="space-y-4">
                        <Field label="Name" required>
                            <Input value={scheduledForm.name} onChange={(e) => setScheduledForm({ ...scheduledForm, name: e.target.value })} placeholder="Monthly Payroll Register" />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Report type" required>
                                <Select value={scheduledForm.reportType} onValueChange={(v) => setScheduledForm({ ...scheduledForm, reportType: v as ScheduledReport["reportType"] })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {REPORT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Frequency">
                                <Select value={scheduledForm.frequency} onValueChange={(v) => setScheduledForm({ ...scheduledForm, frequency: v as ScheduledReport["frequency"] })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Next run date" required>
                                <Input type="date" value={scheduledForm.nextRun} onChange={(e) => setScheduledForm({ ...scheduledForm, nextRun: e.target.value })} />
                            </Field>
                            <Field label="Format">
                                <Select value={scheduledForm.format} onValueChange={(v) => setScheduledForm({ ...scheduledForm, format: v as ScheduledReport["format"] })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CSV">CSV</SelectItem>
                                        <SelectItem value="Excel">Excel</SelectItem>
                                        <SelectItem value="PDF">PDF</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                        <Field label="Recipients (emails)" required>
                            <div className="flex gap-2">
                                <Input
                                    value={recipientInput}
                                    onChange={(e) => setRecipientInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRecipient())}
                                    className="flex-1"
                                    placeholder="finance@fixl.com"
                                    type="email"
                                />
                                <Button type="button" size="sm" onClick={handleAddRecipient} className="h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-semibold text-xs border-none px-3">
                                    <Plus size={13} />
                                </Button>
                            </div>
                            {scheduledForm.recipients.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {scheduledForm.recipients.map((email) => (
                                        <Badge key={email} className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold gap-1 pr-1">
                                            <Mail size={10} /> {email}
                                            <button type="button" onClick={() => handleRemoveRecipient(email)} className="ml-1 hover:text-blue-900">
                                                <XCircle size={10} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Field>
                        <Field label="Notes">
                            <Textarea value={scheduledForm.notes ?? ""} onChange={(e) => setScheduledForm({ ...scheduledForm, notes: e.target.value })} />
                        </Field>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <Label className="text-xs font-bold text-slate-700">Active</Label>
                                <p className="text-[10px] font-medium text-slate-500 mt-0.5">Schedule will auto-run when enabled</p>
                            </div>
                            <Switch checked={scheduledForm.isActive} onCheckedChange={(v) => setScheduledForm({ ...scheduledForm, isActive: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                        </div>
                    </div>
                </SideFormSheet>

                {/* ── Delete Confirm ───────── */}
                <Dialog open={scheduledDeleteOpen} onOpenChange={setScheduledDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete schedule?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                The report will no longer run automatically. Past downloads remain in history.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setScheduledDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteScheduled} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Clear History Confirm ─────── */}
                <Dialog open={clearHistoryOpen} onOpenChange={setClearHistoryOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Clear download history?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                All {downloadHistory.length} entries will be cleared. Export first if needed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setClearHistoryOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleClearHistory} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Clear all</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Custom Report Builder Sheet */}
                <SideFormSheet
                    open={customBuilderOpen}
                    onOpenChange={setCustomBuilderOpen}
                    title={editingCustom ? "Edit custom report" : "New custom report"}
                    description="Configure columns, filters, grouping and pivoting on live payroll data."
                    icon={<Wand2 size={20} />}
                    accentColor={editingCustom ? "#7c3aed" : "#4f46e5"}
                    width="xl"
                    submitLabel={editingCustom ? "Save changes" : "Create report"}
                    onSubmit={(e) => { e.preventDefault(); handleSaveCustom(); }}
                >
                    <div className="space-y-6">
                                {/* Step 1: Name + Source */}
                                <section className="space-y-3">
                                    <SectionHeader step={1} title="Name & data source" icon={FileText} />
                                    <FormField label="Report name" required>
                                        <Input value={customForm.name} onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="Department-wise Net Pay" />
                                    </FormField>
                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-600">Data source <span className="text-rose-500">*</span></Label>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-1.5">
                                            {(["Employees", "Claims", "Payslips", "Declarations", "PayRuns"] as CustomSource[]).map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setCustomForm({ ...customForm, source: s, columns: [], groupBy: undefined, sortBy: undefined, pivotField: undefined, filters: [] })}
                                                    className={cn(
                                                        "rounded-xl border-2 p-3 text-xs font-bold transition-all",
                                                        customForm.source === s
                                                            ? "border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#8B5CF6]"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                                    )}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2: Columns */}
                                <section className="space-y-3">
                                    <SectionHeader step={2} title="Columns" icon={FileSpreadsheet} />
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/60">
                                        {availableColumns.map((c) => (
                                            <label key={c.key} className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-white">
                                                <Checkbox
                                                    checked={customForm.columns.includes(c.key)}
                                                    onCheckedChange={(v) => {
                                                        if (v) setCustomForm({ ...customForm, columns: [...customForm.columns, c.key] })
                                                        else setCustomForm({ ...customForm, columns: customForm.columns.filter((x) => x !== c.key) })
                                                    }}
                                                    className="data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                />
                                                <span className="text-xs font-semibold text-slate-700">{c.label}</span>
                                                {c.numeric && <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-bold px-1">#</Badge>}
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {/* Step 3: Filters */}
                                <section className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader step={3} title="Filters" icon={Filter} />
                                        <Button
                                            size="sm"
                                            onClick={() => setCustomForm({ ...customForm, filters: [...customForm.filters, { field: availableColumns[0]?.key ?? "", op: "eq", value: "" }] })}
                                            className="h-8 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-1 px-3"
                                        >
                                            <Plus size={12} /> Add filter
                                        </Button>
                                    </div>
                                    {customForm.filters.length === 0 ? (
                                        <p className="text-[11px] font-medium text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-xl text-center">
                                            No filters. All rows returned.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {customForm.filters.map((f, i) => (
                                                <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/60">
                                                    <Select value={f.field} onValueChange={(v) => {
                                                        const next = [...customForm.filters]; next[i] = { ...f, field: v }; setCustomForm({ ...customForm, filters: next })
                                                    }}>
                                                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {availableColumns.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={f.op} onValueChange={(v) => {
                                                        const next = [...customForm.filters]; next[i] = { ...f, op: v as CustomReportFilter["op"] }; setCustomForm({ ...customForm, filters: next })
                                                    }}>
                                                        <SelectTrigger className="h-9 text-xs w-28"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="eq">equals</SelectItem>
                                                            <SelectItem value="ne">not equals</SelectItem>
                                                            <SelectItem value="gt">greater than</SelectItem>
                                                            <SelectItem value="lt">less than</SelectItem>
                                                            <SelectItem value="contains">contains</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        value={f.value}
                                                        onChange={(e) => {
                                                            const next = [...customForm.filters]; next[i] = { ...f, value: e.target.value }; setCustomForm({ ...customForm, filters: next })
                                                        }}
                                                        className="h-9 text-xs font-medium"
                                                        placeholder="Value"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCustomForm({ ...customForm, filters: customForm.filters.filter((_, idx) => idx !== i) })}
                                                        className="h-9 w-9 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Step 4: Grouping / Sorting / Pivot */}
                                <section className="space-y-3">
                                    <SectionHeader step={4} title="Group · Sort · Pivot" icon={Layers} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <FormField label="Group by (optional)">
                                            <Select
                                                value={customForm.groupBy ?? "__none__"}
                                                onValueChange={(v) => setCustomForm({ ...customForm, groupBy: v === "__none__" ? undefined : v })}
                                            >
                                                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="No grouping" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">No grouping</SelectItem>
                                                    {availableColumns.filter((c) => !c.numeric).map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Pivot field (optional)">
                                            <Select
                                                value={customForm.pivotField ?? "__none__"}
                                                onValueChange={(v) => setCustomForm({ ...customForm, pivotField: v === "__none__" ? undefined : v })}
                                            >
                                                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="No pivot" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">No pivot</SelectItem>
                                                    {availableColumns.filter((c) => !c.numeric).map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Sort by (optional)">
                                            <Select
                                                value={customForm.sortBy ?? "__none__"}
                                                onValueChange={(v) => setCustomForm({ ...customForm, sortBy: v === "__none__" ? undefined : v })}
                                            >
                                                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="No sort" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">No sort</SelectItem>
                                                    {availableColumns.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Direction">
                                            <Select value={customForm.sortDir ?? "asc"} onValueChange={(v) => setCustomForm({ ...customForm, sortDir: v as "asc" | "desc" })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="asc">Ascending</SelectItem>
                                                    <SelectItem value="desc">Descending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>
                                </section>
                            </div>
                </SideFormSheet>

                {/* ── Custom Delete Confirm ─────── */}
                <Dialog open={customDeleteOpen} onOpenChange={setCustomDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete custom report?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                The definition will be removed. History of past runs is preserved.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCustomDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteCustom} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Custom Report Run Dialog ─────── */}
                <Dialog open={customRunOpen} onOpenChange={setCustomRunOpen}>
                    <DialogContent className="max-w-5xl bg-white rounded-2xl p-0 font-sans max-h-[92vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 pb-4 border-b border-slate-100 space-y-1 shrink-0">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                        <Play size={20} />
                                    </div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">
                                        {customRunTarget?.name ?? "Run report"}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        {customRunTarget && (
                                            <>
                                                Source <span className="font-bold">{customRunTarget.source}</span> · {runTargetRows.length} rows · {customRunTarget.columns.length} columns
                                                {customRunTarget.groupBy && <> · grouped by <span className="font-bold">{customRunTarget.groupBy}</span></>}
                                            </>
                                        )}
                                    </DialogDescription>
                                </div>
                                {customRunTarget && (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => exportCustomCsv(customRunTarget)} className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-1.5">
                                            <Download size={12} /> CSV
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => exportCustomPdf(customRunTarget)} className="h-9 rounded-lg border-[#8B5CF6]/30 text-[#8B5CF6] font-semibold text-xs gap-1.5 hover:bg-[#8B5CF6]/5">
                                            <FileBarChart size={12} /> PDF (mock)
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </DialogHeader>
                        <ScrollArea className="flex-1 overflow-auto">
                            <div className="p-6">
                                {customRunTarget && runTargetPivot ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50/70">
                                                <TableRow className="border-slate-100 hover:bg-transparent">
                                                    <TableHead className="pl-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">{customRunTarget.groupBy}</TableHead>
                                                    {runTargetPivot.pivotKeys.map((k) => (
                                                        <TableHead key={k} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">{k}</TableHead>
                                                    ))}
                                                    <TableHead className="pr-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {runTargetPivot.rows.map((r) => (
                                                    <TableRow key={r.group} className="border-slate-50 hover:bg-slate-50/70">
                                                        <TableCell className="pl-4 py-3 text-sm font-semibold text-slate-900">{r.group}</TableCell>
                                                        {runTargetPivot.pivotKeys.map((k) => (
                                                            <TableCell key={k} className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">
                                                                {r.cells[k] ?? 0}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell className="pr-4 py-3 text-xs font-bold text-[#8B5CF6] text-right tabular-nums">{r.total}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : customRunTarget && runTargetGrouped ? (
                                    <div className="space-y-4">
                                        {runTargetGrouped.map((g) => (
                                            <div key={g.key} className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="flex items-center justify-between bg-[#8B5CF6]/5 px-4 py-2.5 border-b border-slate-200">
                                                    <div className="flex items-center gap-2">
                                                        <Layers size={14} className="text-[#8B5CF6]" />
                                                        <span className="text-sm font-bold text-slate-900">{g.key}</span>
                                                        <Badge className="bg-white text-slate-600 border border-slate-200 text-[10px] font-bold">{g.rows.length}</Badge>
                                                    </div>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader className="bg-slate-50/70">
                                                            <TableRow className="border-slate-100 hover:bg-transparent">
                                                                {customRunTarget.columns.map((c) => (
                                                                    <TableHead key={c} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">{c}</TableHead>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {g.rows.map((row, i) => (
                                                                <TableRow key={i} className="border-slate-50 hover:bg-slate-50/70">
                                                                    {customRunTarget.columns.map((c) => (
                                                                        <TableCell key={c} className="py-2.5 text-xs font-medium text-slate-700">{String(row[c] ?? "")}</TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : customRunTarget ? (
                                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                                        <Table>
                                            <TableHeader className="bg-slate-50/70">
                                                <TableRow className="border-slate-100 hover:bg-transparent">
                                                    {customRunTarget.columns.map((c) => (
                                                        <TableHead key={c} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">{c}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {runTargetRows.length === 0 ? (
                                                    <TableRow><TableCell colSpan={customRunTarget.columns.length} className="py-10 text-center text-sm text-slate-400 font-medium">No rows match the filters.</TableCell></TableRow>
                                                ) : runTargetRows.map((row, i) => (
                                                    <TableRow key={i} className="border-slate-50 hover:bg-slate-50/70">
                                                        {customRunTarget.columns.map((c) => (
                                                            <TableCell key={c} className="py-2.5 text-xs font-medium text-slate-700">{String(row[c] ?? "")}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : null}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                {/* ── Variance MoM Dialog ─────── */}
                <Dialog open={varianceDialogOpen} onOpenChange={setVarianceDialogOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-6 font-sans max-h-[92vh] overflow-y-auto">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-2">
                                <ArrowLeftRight size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Month-over-Month variance</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Compare column totals and deltas across any two pay runs.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <FormField label="Run A (current)">
                                <Select value={varianceRunA} onValueChange={setVarianceRunA}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {payRuns.map((r) => <SelectItem key={r.id} value={r.id}>{r.month} · {r.status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Run B (baseline)">
                                <Select value={varianceRunB} onValueChange={setVarianceRunB}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {payRuns.map((r) => <SelectItem key={r.id} value={r.id}>{r.month} · {r.status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                        {varianceMoM ? (
                            <div className="mt-5 rounded-xl border border-slate-200 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50/70">
                                        <TableRow className="border-slate-100 hover:bg-transparent">
                                            <TableHead className="pl-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Component</TableHead>
                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">{varianceMoM.a.month}</TableHead>
                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">{varianceMoM.b.month}</TableHead>
                                            <TableHead className="pr-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 text-right">Delta %</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { label: "Employees", a: varianceMoM.aRoll.count, b: varianceMoM.bRoll.count, money: false },
                                            { label: "Gross earnings", a: varianceMoM.aRoll.gross, b: varianceMoM.bRoll.gross },
                                            { label: "Net pay", a: varianceMoM.aRoll.net, b: varianceMoM.bRoll.net },
                                            { label: "Total deductions", a: varianceMoM.aRoll.ded, b: varianceMoM.bRoll.ded },
                                            { label: "PF", a: varianceMoM.aRoll.pf, b: varianceMoM.bRoll.pf },
                                            { label: "ESI", a: varianceMoM.aRoll.esi, b: varianceMoM.bRoll.esi },
                                            { label: "PT", a: varianceMoM.aRoll.pt, b: varianceMoM.bRoll.pt },
                                            { label: "TDS", a: varianceMoM.aRoll.tds, b: varianceMoM.bRoll.tds },
                                        ].map((row) => {
                                            const delta = row.a - row.b
                                            const pct = row.b === 0 ? 0 : (delta / row.b) * 100
                                            const threshold = 5
                                            return (
                                                <TableRow key={row.label} className="border-slate-50 hover:bg-slate-50/70">
                                                    <TableCell className="pl-4 py-3 text-sm font-semibold text-slate-900">{row.label}</TableCell>
                                                    <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">
                                                        {row.money === false ? row.a : formatINR(row.a)}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-xs font-medium text-slate-700 text-right tabular-nums">
                                                        {row.money === false ? row.b : formatINR(row.b)}
                                                    </TableCell>
                                                    <TableCell className={cn(
                                                        "pr-4 py-3 text-xs font-bold text-right tabular-nums",
                                                        Math.abs(pct) < threshold ? "text-slate-500" : pct > 0 ? "text-rose-600" : "text-emerald-600"
                                                    )}>
                                                        {row.b === 0 ? "—" : `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="mt-5 text-[11px] font-medium text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-xl text-center">
                                Pick two pay runs above.
                            </p>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setVarianceDialogOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// ── Helpers for report run rendering ──────────────────────────────
function groupRows(rows: any[], key: string): { key: string; rows: any[] }[] {
    const map = new Map<string, any[]>()
    rows.forEach((r) => {
        const k = String(r[key] ?? "—")
        if (!map.has(k)) map.set(k, [])
        map.get(k)!.push(r)
    })
    return Array.from(map.entries()).map(([k, v]) => ({ key: k, rows: v }))
}

function pivotRows(
    rows: any[],
    groupKey: string,
    pivotKey: string,
    colDefs: { key: string; label: string; numeric?: boolean }[]
): { pivotKeys: string[]; rows: { group: string; cells: Record<string, number>; total: number }[] } {
    const pivotKeys = Array.from(new Set(rows.map((r) => String(r[pivotKey] ?? "—"))))
    const groupMap = new Map<string, Record<string, number>>()
    const numericCol = colDefs.find((c) => c.numeric && c.key !== groupKey && c.key !== pivotKey)
    rows.forEach((r) => {
        const g = String(r[groupKey] ?? "—")
        const p = String(r[pivotKey] ?? "—")
        const cells = groupMap.get(g) ?? {}
        const add = numericCol ? Number(r[numericCol.key] ?? 0) : 1
        cells[p] = (cells[p] ?? 0) + add
        groupMap.set(g, cells)
    })
    const out = Array.from(groupMap.entries()).map(([g, cells]) => {
        const total = pivotKeys.reduce((s, k) => s + (cells[k] ?? 0), 0)
        return { group: g, cells, total }
    })
    return { pivotKeys, rows: out }
}

const StatCard = ({ label, value, caption, icon: Icon, color }: { label: string; value: string; caption: string; icon: any; color: string }) => (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight tabular-nums truncate">{value}</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">{caption}</p>
                </div>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}14`, color }}>
                    <Icon size={18} />
                </div>
            </div>
        </CardContent>
    </Card>
)

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {children}
    </div>
)

const SectionHeader = ({ step, title, icon: Icon }: { step: number; title: string; icon: any }) => (
    <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold text-xs">
            {step}
        </div>
        <div className="flex items-center gap-2">
            <Icon size={14} className="text-[#8B5CF6]" />
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
    </div>
)

export default PayrollReportsPage
