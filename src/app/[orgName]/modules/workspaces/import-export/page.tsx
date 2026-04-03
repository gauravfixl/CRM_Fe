"use client"

import React, { useState, useMemo } from "react"
import {
    Upload, Download, FileText, Clock, CheckCircle, XCircle,
    AlertTriangle, ChevronDown, Trash2, FileJson, Table2, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssueStatus, type IssuePriority, type IssueType } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Select as ProjectSelect, SelectContent as PSC, SelectItem as PSI, SelectTrigger as PST, SelectValue as PSV } from "@/components/ui/select"

const FIELD_OPTIONS = ["Title", "Type", "Status", "Priority", "Assignee", "Due Date", "Story Points", "Labels", "Description", "Skip"]
const EXPORT_FIELDS = ["Key", "Title", "Type", "Status", "Priority", "Assignee", "Sprint", "Epic", "Story Points", "Due Date", "Created", "Labels", "Description"]

interface HistoryEntry {
    id: string
    type: "Import" | "Export"
    date: string
    records: number
    status: "Success" | "Failed" | "Partial"
    format: "CSV" | "JSON"
}

export default function ImportExportPage() {
    const { issues, addIssue } = useIssueStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const workspaceProjects = useMemo(() => projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId), [projects, activeWorkspaceId])
    React.useEffect(() => { if (!selectedProjectId && workspaceProjects.length > 0) setSelectedProjectId(workspaceProjects[0].id) }, [workspaceProjects, selectedProjectId])
    const [activeTab, setActiveTab] = useState("import")

    // Import state
    const [csvText, setCsvText] = useState("")
    const [parsedRows, setParsedRows] = useState<string[][]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [fieldMapping, setFieldMapping] = useState<Record<number, string>>({})
    const [importStep, setImportStep] = useState<"upload" | "mapping" | "preview">("upload")
    const [importErrors, setImportErrors] = useState<string[]>([])

    // Export state
    const [exportScope, setExportScope] = useState("all")
    const [exportFormat, setExportFormat] = useState<"CSV" | "JSON">("CSV")
    const [exportFields, setExportFields] = useState<Set<string>>(new Set(EXPORT_FIELDS))
    const [exportStatusFilter, setExportStatusFilter] = useState<string>("all")

    // History state
    const [history, setHistory] = useState<HistoryEntry[]>([
        { id: "h1", type: "Export", date: new Date(Date.now() - 86400000).toISOString(), records: 15, status: "Success", format: "CSV" },
        { id: "h2", type: "Import", date: new Date(Date.now() - 172800000).toISOString(), records: 8, status: "Success", format: "CSV" },
        { id: "h3", type: "Export", date: new Date(Date.now() - 259200000).toISOString(), records: 22, status: "Success", format: "JSON" },
    ])

    // Parse CSV text
    const handleParseCSV = () => {
        if (!csvText.trim()) {
            toast.error("Please paste CSV data first")
            return
        }
        const lines = csvText.trim().split("\n").map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")))
        if (lines.length < 2) {
            toast.error("CSV must have at least a header row and one data row")
            return
        }
        setHeaders(lines[0])
        setParsedRows(lines.slice(1))
        // Auto-map fields
        const autoMap: Record<number, string> = {}
        lines[0].forEach((h, i) => {
            const lower = h.toLowerCase()
            if (lower.includes("title") || lower.includes("name") || lower.includes("summary")) autoMap[i] = "Title"
            else if (lower.includes("type")) autoMap[i] = "Type"
            else if (lower.includes("status")) autoMap[i] = "Status"
            else if (lower.includes("priority")) autoMap[i] = "Priority"
            else if (lower.includes("assign")) autoMap[i] = "Assignee"
            else if (lower.includes("due") || lower.includes("date")) autoMap[i] = "Due Date"
            else if (lower.includes("point") || lower.includes("story")) autoMap[i] = "Story Points"
            else if (lower.includes("label") || lower.includes("tag")) autoMap[i] = "Labels"
            else if (lower.includes("desc")) autoMap[i] = "Description"
            else autoMap[i] = "Skip"
        })
        setFieldMapping(autoMap)
        setImportStep("mapping")
        toast.success(`Parsed ${lines.length - 1} rows with ${lines[0].length} columns`)
    }

    const handleProceedToPreview = () => {
        const errors: string[] = []
        const mappedFields = Object.values(fieldMapping)
        if (!mappedFields.includes("Title")) errors.push("Title field is required")
        if (errors.length > 0) {
            setImportErrors(errors)
            toast.error("Please fix mapping errors before proceeding")
            return
        }
        setImportErrors([])
        setImportStep("preview")
    }

    const getMappedValue = (row: string[], field: string): string => {
        const colIndex = Object.entries(fieldMapping).find(([_, v]) => v === field)?.[0]
        if (colIndex === undefined) return ""
        return row[parseInt(colIndex)] || ""
    }

    const handleImport = () => {
        let successCount = 0
        let errorCount = 0
        parsedRows.forEach((row, idx) => {
            const title = getMappedValue(row, "Title")
            if (!title) { errorCount++; return }
            const typeRaw = getMappedValue(row, "Type").toUpperCase()
            const validTypes: IssueType[] = ["TASK", "BUG", "STORY", "EPIC", "SUBTASK"]
            const type: IssueType = validTypes.includes(typeRaw as IssueType) ? (typeRaw as IssueType) : "TASK"
            const statusRaw = getMappedValue(row, "Status").toUpperCase().replace(/ /g, "_")
            const status: IssueStatus = (statusRaw as IssueStatus) || "TODO"
            const priorityRaw = getMappedValue(row, "Priority").toUpperCase()
            const validPriorities: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"]
            const priority: IssuePriority = validPriorities.includes(priorityRaw as IssuePriority) ? (priorityRaw as IssuePriority) : "MEDIUM"
            const pointsRaw = getMappedValue(row, "Story Points")
            const storyPoints = pointsRaw ? parseInt(pointsRaw) || undefined : undefined
            const dueDate = getMappedValue(row, "Due Date") || undefined
            const labelsRaw = getMappedValue(row, "Labels")
            const labels = labelsRaw ? labelsRaw.split(";").map(l => l.trim()).filter(Boolean) : undefined
            const description = getMappedValue(row, "Description") || ""
            const assignee = getMappedValue(row, "Assignee") || ""

            const newIssue: Issue = {
                id: `IMPORT-${Date.now()}-${idx}`,
                projectId: selectedProjectId,
                title,
                description,
                status,
                priority,
                type,
                assigneeId: assignee,
                reporterId: "u1",
                createdAt: new Date().toISOString(),
                storyPoints,
                dueDate,
                labels,
                columnOrder: 0,
                history: [],
            }
            addIssue(newIssue)
            successCount++
        })

        setHistory(prev => [{
            id: `h-${Date.now()}`,
            type: "Import",
            date: new Date().toISOString(),
            records: successCount,
            status: errorCount > 0 ? "Partial" : "Success",
            format: "CSV",
        }, ...prev])

        toast.success(`Imported ${successCount} issues${errorCount > 0 ? `, ${errorCount} failed` : ""}`)
        setCsvText("")
        setParsedRows([])
        setHeaders([])
        setFieldMapping({})
        setImportStep("upload")
    }

    // Export logic
    const exportIssues = useMemo(() => {
        let filtered = issues.filter(i => i.projectId === selectedProjectId)
        if (exportScope === "backlog") filtered = filtered.filter(i => !i.sprintId)
        else if (exportScope === "current-sprint") filtered = filtered.filter(i => i.sprintId)
        if (exportStatusFilter !== "all") filtered = filtered.filter(i => i.status === exportStatusFilter)
        return filtered
    }, [issues, exportScope, exportStatusFilter])

    const getExportFieldValue = (issue: Issue, field: string): string => {
        switch (field) {
            case "Key": return issue.id
            case "Title": return issue.title
            case "Type": return issue.type
            case "Status": return issue.status
            case "Priority": return issue.priority
            case "Assignee": return issue.assignee?.name || issue.assigneeId || ""
            case "Sprint": return issue.sprintId || ""
            case "Epic": return issue.epicId || ""
            case "Story Points": return issue.storyPoints?.toString() || ""
            case "Due Date": return issue.dueDate || ""
            case "Created": return issue.createdAt
            case "Labels": return (issue.labels || []).join("; ")
            case "Description": return issue.description
            default: return ""
        }
    }

    const handleExport = () => {
        const fields = EXPORT_FIELDS.filter(f => exportFields.has(f))
        if (fields.length === 0) { toast.error("Select at least one field"); return }
        let content = ""
        let filename = ""

        if (exportFormat === "CSV") {
            const headerLine = fields.join(",")
            const dataLines = exportIssues.map(issue => fields.map(f => `"${getExportFieldValue(issue, f).replace(/"/g, '""')}"`).join(","))
            content = [headerLine, ...dataLines].join("\n")
            filename = `issues-export-${Date.now()}.csv`
        } else {
            const data = exportIssues.map(issue => {
                const obj: Record<string, string> = {}
                fields.forEach(f => { obj[f] = getExportFieldValue(issue, f) })
                return obj
            })
            content = JSON.stringify(data, null, 2)
            filename = `issues-export-${Date.now()}.json`
        }

        const blob = new Blob([content], { type: exportFormat === "CSV" ? "text/csv" : "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setHistory(prev => [{
            id: `h-${Date.now()}`,
            type: "Export",
            date: new Date().toISOString(),
            records: exportIssues.length,
            status: "Success",
            format: exportFormat,
        }, ...prev])

        toast.success(`Exported ${exportIssues.length} issues as ${exportFormat}`)
    }

    const toggleExportField = (field: string) => {
        setExportFields(prev => {
            const next = new Set(prev)
            next.has(field) ? next.delete(field) : next.add(field)
            return next
        })
    }

    const handleDeleteHistory = (id: string) => {
        setHistory(prev => prev.filter(h => h.id !== id))
        toast.success("History entry removed")
    }

    const previewRows = parsedRows.slice(0, 5)
    const exportPreview = exportIssues.slice(0, 5)

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <div className="flex-1 flex flex-col gap-5 p-6">
                {/* BREADCRUMB */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                        <span>PROJECTS</span><span>/</span><span className="text-zinc-900 font-semibold">IMPORT & EXPORT</span>
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight mt-2">Import & Export</h1>
                    <p className="text-xs text-zinc-500 font-medium">Import issues from CSV/JSON or export your project data.</p>
                </div>

                {/* TABS */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white border border-zinc-200 rounded-lg p-1 h-auto">
                        <TabsTrigger value="import" className="text-xs font-medium px-4 py-1.5 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <Upload className="w-3.5 h-3.5 mr-2" /> Import
                        </TabsTrigger>
                        <TabsTrigger value="export" className="text-xs font-medium px-4 py-1.5 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <Download className="w-3.5 h-3.5 mr-2" /> Export
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-xs font-medium px-4 py-1.5 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <Clock className="w-3.5 h-3.5 mr-2" /> History
                        </TabsTrigger>
                    </TabsList>

                    {/* IMPORT TAB */}
                    <TabsContent value="import" className="mt-4 space-y-4">
                        {importStep === "upload" && (
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
                                <h2 className="text-sm font-bold text-zinc-900">Upload CSV Data</h2>
                                <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                                    <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                                    <p className="text-xs text-zinc-500 font-medium mb-1">Drop CSV/JSON file here or paste CSV data below</p>
                                    <p className="text-[10px] text-zinc-400">Supports comma-separated values with headers</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Paste CSV Text</label>
                                    <textarea
                                        className="w-full h-40 border border-zinc-200 rounded-lg p-3 text-xs font-mono text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                                        placeholder={'Title,Type,Status,Priority,Assignee,Story Points\n"Fix login bug",BUG,TODO,HIGH,"John Doe",3\n"Add dashboard",STORY,TODO,MEDIUM,"Jane Smith",8'}
                                        value={csvText}
                                        onChange={(e) => setCsvText(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleParseCSV}
                                >
                                    <Upload className="w-3.5 h-3.5 mr-2" /> Parse CSV
                                </Button>
                            </div>
                        )}

                        {importStep === "mapping" && (
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-zinc-900">Field Mapping</h2>
                                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setImportStep("upload")}>
                                        <X className="w-3.5 h-3.5 mr-2" /> Back
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-500">Map each CSV column to an issue field. At minimum, map the Title field.</p>
                                {importErrors.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                                        {importErrors.map((err, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-red-600">
                                                <AlertTriangle className="w-3 h-3" /> {err}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="grid gap-3">
                                    {headers.map((header, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-zinc-50 rounded-lg p-3">
                                            <span className="text-xs font-mono text-zinc-600 w-40 truncate">{header}</span>
                                            <ChevronDown className="w-3 h-3 text-zinc-400" />
                                            <Select value={fieldMapping[i] || "Skip"} onValueChange={(val) => setFieldMapping(prev => ({ ...prev, [i]: val }))}>
                                                <SelectTrigger className="h-8 w-44 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FIELD_OPTIONS.map(opt => (
                                                        <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0">{fieldMapping[i] === "Skip" ? "Ignored" : "Mapped"}</Badge>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleProceedToPreview}
                                >
                                    Preview Import
                                </Button>
                            </div>
                        )}

                        {importStep === "preview" && (
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-zinc-900">Preview ({parsedRows.length} rows)</h2>
                                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setImportStep("mapping")}>
                                        <X className="w-3.5 h-3.5 mr-2" /> Back to Mapping
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-500">Showing first {Math.min(5, parsedRows.length)} rows. Verify the mapping looks correct.</p>
                                <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {FIELD_OPTIONS.filter(f => f !== "Skip" && Object.values(fieldMapping).includes(f)).map(f => (
                                                    <TableHead key={f} className="text-[11px] font-semibold text-zinc-500 uppercase">{f}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewRows.map((row, ri) => (
                                                <TableRow key={ri}>
                                                    {FIELD_OPTIONS.filter(f => f !== "Skip" && Object.values(fieldMapping).includes(f)).map(f => (
                                                        <TableCell key={f} className="text-xs text-zinc-700">{getMappedValue(row, f) || "-"}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        onClick={handleImport}
                                    >
                                        <Upload className="w-3.5 h-3.5 mr-2" /> Import {parsedRows.length} Issues
                                    </Button>
                                    <span className="text-[10px] text-zinc-400">Issues will be created in project {selectedProjectId}</span>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* EXPORT TAB */}
                    <TabsContent value="export" className="mt-4 space-y-4">
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-bold text-zinc-900">Export Configuration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Scope</label>
                                    <Select value={exportScope} onValueChange={setExportScope}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="text-xs">All Issues</SelectItem>
                                            <SelectItem value="current-sprint" className="text-xs">Current Sprint Issues</SelectItem>
                                            <SelectItem value="backlog" className="text-xs">Backlog</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Status Filter</label>
                                    <Select value={exportStatusFilter} onValueChange={setExportStatusFilter}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                                            <SelectItem value="TODO" className="text-xs">TODO</SelectItem>
                                            <SelectItem value="IN_PROGRESS" className="text-xs">In Progress</SelectItem>
                                            <SelectItem value="IN_REVIEW" className="text-xs">In Review</SelectItem>
                                            <SelectItem value="DONE" className="text-xs">Done</SelectItem>
                                            <SelectItem value="BACKLOG" className="text-xs">Backlog</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Format</label>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={exportFormat === "CSV" ? "default" : "outline"}
                                            className={`h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 flex-1 ${exportFormat === "CSV" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                                            onClick={() => setExportFormat("CSV")}
                                        >
                                            <Table2 className="w-3.5 h-3.5 mr-1" /> CSV
                                        </Button>
                                        <Button
                                            variant={exportFormat === "JSON" ? "default" : "outline"}
                                            className={`h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 flex-1 ${exportFormat === "JSON" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                                            onClick={() => setExportFormat("JSON")}
                                        >
                                            <FileJson className="w-3.5 h-3.5 mr-1" /> JSON
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-bold text-zinc-900">Fields to Export</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {EXPORT_FIELDS.map(field => (
                                    <label key={field} className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={exportFields.has(field)}
                                            onChange={() => toggleExportField(field)}
                                            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-xs font-medium text-zinc-700">{field}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-bold text-zinc-900">Preview ({exportIssues.length} issues)</h2>
                            {exportPreview.length > 0 ? (
                                <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {EXPORT_FIELDS.filter(f => exportFields.has(f)).map(f => (
                                                    <TableHead key={f} className="text-[11px] font-semibold text-zinc-500 uppercase">{f}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {exportPreview.map(issue => (
                                                <TableRow key={issue.id}>
                                                    {EXPORT_FIELDS.filter(f => exportFields.has(f)).map(f => (
                                                        <TableCell key={f} className="text-xs text-zinc-700 max-w-[200px] truncate">{getExportFieldValue(issue, f) || "-"}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-xs text-zinc-400">No issues match the current scope and filters.</div>
                            )}
                            <Button
                                className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={handleExport}
                                disabled={exportIssues.length === 0}
                            >
                                <Download className="w-3.5 h-3.5 mr-2" /> Export {exportIssues.length} Issues as {exportFormat}
                            </Button>
                        </div>
                    </TabsContent>

                    {/* HISTORY TAB */}
                    <TabsContent value="history" className="mt-4">
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-200">
                                <h2 className="text-sm font-bold text-zinc-900">Import/Export History</h2>
                                <p className="text-xs text-zinc-500 font-medium mt-1">Recent import and export operations.</p>
                            </div>
                            {history.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Type</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Date</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Records</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Status</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Format</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.map(entry => (
                                            <TableRow key={entry.id}>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${entry.type === "Import" ? "border-blue-200 text-blue-600" : "border-green-200 text-green-600"}`}>
                                                        {entry.type === "Import" ? <Upload className="w-2.5 h-2.5 mr-1" /> : <Download className="w-2.5 h-2.5 mr-1" />}
                                                        {entry.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-zinc-600">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}</TableCell>
                                                <TableCell className="text-xs font-medium text-zinc-900">{entry.records}</TableCell>
                                                <TableCell>
                                                    <Badge className={`text-[9px] px-1.5 py-0 border-none ${entry.status === "Success" ? "bg-green-100 text-green-700" : entry.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                                        {entry.status === "Success" ? <CheckCircle className="w-2.5 h-2.5 mr-1" /> : entry.status === "Failed" ? <XCircle className="w-2.5 h-2.5 mr-1" /> : <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
                                                        {entry.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{entry.format}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" className="h-6 w-6 p-0 text-zinc-400 hover:text-red-500" onClick={() => handleDeleteHistory(entry.id)}>
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-12 text-xs text-zinc-400">No import/export history yet.</div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
