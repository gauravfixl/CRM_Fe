"use client"

import React, { useEffect, useState, useRef } from "react"
import {
    ArrowUpDown,
    Upload,
    Download,
    FileSpreadsheet,
    FileJson,
    FileCode,
    CheckCircle2,
    AlertTriangle,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"

type Tab = "import" | "export"

interface ImportResult {
    success: boolean
    imported: number
    skipped: number
    error?: string
}

function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
    if (lines.length < 2) return []

    const splitLine = (line: string): string[] => {
        const result: string[] = []
        let cur = ""
        let inQuote = false
        for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (ch === '"') {
                if (inQuote && line[i + 1] === '"') {
                    cur += '"'
                    i++
                } else {
                    inQuote = !inQuote
                }
            } else if (ch === "," && !inQuote) {
                result.push(cur)
                cur = ""
            } else {
                cur += ch
            }
        }
        result.push(cur)
        return result
    }

    const headers = splitLine(lines[0]).map(h => h.trim())
    const rows: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
        const cells = splitLine(lines[i])
        const obj: Record<string, string> = {}
        headers.forEach((h, idx) => {
            obj[h] = (cells[idx] || "").trim()
        })
        rows.push(obj)
    }
    return rows
}

export default function ImportExportPage() {
    const [mounted, setMounted] = useState(false)
    const { issues, addIssue } = useIssueStore()
    const { projects } = useProjectStore()
    const [tab, setTab] = useState<Tab>("import")
    const [isImporting, setIsImporting] = useState(false)
    const [importResult, setImportResult] = useState<ImportResult | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    if (!mounted) return null

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsImporting(true)
        setImportResult(null)

        try {
            const text = await file.text()
            let imported = 0
            let skipped = 0
            const existingIds = new Set(issues.map(i => i.id))
            const existingTitles = new Set(issues.map(i => i.title.toLowerCase()))

            const isJson = file.name.toLowerCase().endsWith(".json")
            let candidates: Partial<Issue>[] = []

            if (isJson) {
                const data = JSON.parse(text)
                candidates = Array.isArray(data) ? data : (data.issues || data.tasks || [])
            } else {
                const rows = parseCSV(text)
                candidates = rows.map(r => ({
                    id: r.id || undefined,
                    title: r.title,
                    description: r.description || "",
                    status: (r.status || "TODO") as Issue["status"],
                    priority: (r.priority || "MEDIUM") as Issue["priority"],
                    projectId: r.projectId,
                    type: (r.type || "TASK") as Issue["type"],
                    assigneeId: r.assigneeId || "",
                    reporterId: r.reporterId || "",
                    storyPoints: r.storyPoints ? Number(r.storyPoints) : undefined,
                    dueDate: r.dueDate || undefined,
                }))
            }

            const validProjectIds = new Set(projects.map(p => p.id))

            candidates.forEach(c => {
                if (!c.title) { skipped++; return }
                if (!c.projectId || !validProjectIds.has(c.projectId)) {
                    // Default to first project if missing/invalid
                    if (projects.length === 0) { skipped++; return }
                    c.projectId = projects[0].id
                }
                const id = c.id && !existingIds.has(c.id) ? c.id : `ISSUE-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
                if (existingIds.has(id) || existingTitles.has((c.title || "").toLowerCase())) {
                    skipped++
                    return
                }
                const newIssue: Issue = {
                    id,
                    projectId: c.projectId!,
                    title: c.title!,
                    description: c.description || "",
                    status: c.status || "TODO",
                    priority: c.priority || "MEDIUM",
                    type: c.type || "TASK",
                    assigneeId: c.assigneeId || "",
                    reporterId: c.reporterId || "",
                    createdAt: c.createdAt || new Date().toISOString(),
                    storyPoints: c.storyPoints,
                    dueDate: c.dueDate,
                    columnOrder: 0,
                    history: [],
                }
                addIssue(newIssue)
                existingIds.add(id)
                existingTitles.add(newIssue.title.toLowerCase())
                imported++
            })

            setImportResult({ success: true, imported, skipped })
        } catch (err: any) {
            setImportResult({ success: false, imported: 0, skipped: 0, error: err?.message || "Failed to parse file" })
        } finally {
            setIsImporting(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleExport = (format: "json" | "csv") => {
        const data = format === "json"
            ? JSON.stringify({ projects, issues }, null, 2)
            : ["id,title,status,priority,type,projectId,assigneeId,storyPoints,dueDate",
                ...issues.map(i => [
                    i.id,
                    `"${(i.title || "").replace(/"/g, '""')}"`,
                    i.status,
                    i.priority,
                    i.type,
                    i.projectId,
                    i.assigneeId || "",
                    i.storyPoints || "",
                    i.dueDate || "",
                ].join(","))
            ].join("\n")
        const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `pm-export-${Date.now()}.${format}`
        a.click()
        URL.revokeObjectURL(url)
    }

    const kpis = [
        { label: "Projects", value: projects.length, icon: <FileSpreadsheet size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "Tasks", value: issues.length, icon: <FileJson size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Formats", value: "CSV/JSON", icon: <FileCode size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Last Sync", value: "Local", icon: <ArrowUpDown size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <ArrowUpDown size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Import / Export</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Move data in and out of the workspace.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <div key={i} className={`block border shadow-sm h-[75px] rounded-none ${stat.bg}`}>
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>{stat.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-base font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-5 border-b border-slate-200">
                {(["import", "export"] as Tab[]).map(t => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`px-3 py-2 text-[12px] font-bold capitalize border-b-2 transition-colors rounded-none ${tab === t ? "text-indigo-600 border-indigo-600" : "text-slate-400 hover:text-slate-700 border-transparent"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === "import" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Card className="border border-slate-200 bg-white p-6 rounded-none">
                        <h3 className="text-base font-bold text-slate-900 mb-2">Upload File</h3>
                        <p className="text-xs text-slate-500 mb-4">Supports CSV, JSON. The data is parsed and merged into your local store.</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.json"
                            onChange={handleImport}
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isImporting}
                            className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none"
                        >
                            {isImporting ? <><Loader2 size={14} className="animate-spin" /> Importing...</> : <><Upload size={14} /> Choose File</>}
                        </Button>
                        {importResult && (
                            <div className={`mt-3 p-3 border rounded-none ${importResult.success ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                                {importResult.success ? (
                                    <p className="text-[12px] font-bold text-emerald-700 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} /> Imported {importResult.imported} issues. Skipped {importResult.skipped} duplicate/invalid rows.
                                    </p>
                                ) : (
                                    <p className="text-[12px] font-bold text-rose-700 flex items-center gap-1.5">
                                        <AlertTriangle size={14} /> Import failed: {importResult.error}
                                    </p>
                                )}
                            </div>
                        )}
                    </Card>
                    <Card className="border border-slate-200 bg-slate-50 p-6 rounded-none">
                        <h3 className="text-base font-bold text-slate-900 mb-2">Import Tips</h3>
                        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                            <li>CSV headers: <code className="bg-white px-1 py-0.5">id,title,status,priority,type,projectId,assigneeId,storyPoints,dueDate</code></li>
                            <li>For JSON, pass a top-level <code className="bg-white px-1 py-0.5">issues</code> array or a plain array.</li>
                            <li>Existing IDs and duplicate titles are skipped.</li>
                            <li>Invalid <code className="bg-white px-1 py-0.5">projectId</code> falls back to the first project.</li>
                        </ul>
                    </Card>
                </div>
            )}

            {tab === "export" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Card className="border border-slate-200 bg-white p-6 rounded-none">
                        <h3 className="text-base font-bold text-slate-900 mb-2">Export as JSON</h3>
                        <p className="text-xs text-slate-500 mb-4">Includes projects and all issues with full metadata.</p>
                        <Button onClick={() => handleExport("json")} className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 rounded-none">
                            <Download size={14} /> Download JSON
                        </Button>
                    </Card>
                    <Card className="border border-slate-200 bg-white p-6 rounded-none">
                        <h3 className="text-base font-bold text-slate-900 mb-2">Export as CSV</h3>
                        <p className="text-xs text-slate-500 mb-4">Issues only, flattened for spreadsheet tools.</p>
                        <Button onClick={() => handleExport("csv")} className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 rounded-none">
                            <Download size={14} /> Download CSV
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    )
}
