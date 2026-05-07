"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Download, FilePlus2, Bell, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmProductsStore, type ScmProduct } from "@/shared/data/scm/scm-products-store"

interface SuggestionRow extends ScmProduct {
    suggestedQuantity: number
    urgency: "Low" | "Medium" | "High" | "Critical"
}

const computeUrgency = (current: number, reorder: number): SuggestionRow["urgency"] => {
    if (current === 0) return "Critical"
    if (current < reorder * 0.5) return "High"
    if (current <= reorder) return "Medium"
    return "Low"
}

export default function ReorderSuggestionsPage() {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const [ignored, setIgnored] = useState<Set<string>>(new Set())

    const rows: SuggestionRow[] = useMemo(
        () => products
            .filter((p) => p.currentStock <= p.reorderLevel * 1.2 && !ignored.has(p.id))
            .map((p) => ({ ...p, suggestedQuantity: Math.max(p.reorderLevel * 2 - p.currentStock, 1), urgency: computeUrgency(p.currentStock, p.reorderLevel) })),
        [products, ignored]
    )

    const handleIgnore = (id: string) => {
        setIgnored((s) => new Set(s).add(id))
        toast({ title: "Suggestion ignored" })
    }
    const handleReminder = (p: SuggestionRow) => {
        toast({ title: "Reminder set", description: `${p.productName} - check in 7 days` })
    }

    const columns: DataTableColumn<SuggestionRow>[] = useMemo(
        () => [
            { key: "sku", header: "SKU", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.sku}</span> },
            { key: "productName", header: "Product", sortable: true, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.category}</p></div>
            )},
            { key: "currentStock", header: "Current", width: "100px", align: "right", render: (r) => <span className="tabular-nums">{r.currentStock}</span> },
            { key: "reorderLevel", header: "Reorder ≤", width: "110px", align: "right", render: (r) => <span className="tabular-nums text-[#64748B]">{r.reorderLevel}</span> },
            { key: "suggestedQuantity", header: "Suggest Buy", width: "120px", align: "right", sortable: true, accessor: (r) => r.suggestedQuantity, render: (r) => <span className="tabular-nums font-semibold text-emerald-700">{r.suggestedQuantity}</span> },
            { key: "urgency", header: "Urgency", width: "120px", render: (r) => <StatusBadge status={r.urgency} tone={r.urgency === "Critical" ? "danger" : r.urgency === "High" ? "warning" : r.urgency === "Medium" ? "info" : "neutral"} /> },
        ],
        []
    )

    const handleExport = () => {
        if (rows.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["SKU", "Product", "Category", "Current Stock", "Reorder Level", "Suggested Quantity", "Urgency"]
        const data = rows.map((r) => [r.sku, r.productName, r.category, r.currentStock, r.reorderLevel, r.suggestedQuantity, r.urgency])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...data].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-reorder-suggestions-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${data.length} suggestions exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Reorder Suggestions</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">AI-suggested items to replenish based on stock and demand patterns.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                rowKey={(r) => r.id}
                searchPlaceholder="Search products..."
                searchKeys={["sku", "productName", "category"]}
                pageSize={15}
                emptyMessage="No reorder suggestions. Stock levels are healthy."
                actions={(row) => (
                    <div className="flex items-center gap-1 justify-end">
                        <Link href="/scm/procurement/purchase-requests" title="Create PR">
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-emerald-700 hover:bg-emerald-50">
                                <FilePlus2 className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button onClick={() => handleReminder(row)} size="sm" variant="ghost" className="h-8 px-2 text-blue-600 hover:bg-blue-50" title="Set reminder">
                            <Bell className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleIgnore(row.id)} size="sm" variant="ghost" className="h-8 px-2 text-[#64748B] hover:bg-slate-100" title="Ignore">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            />
        </div>
    )
}
