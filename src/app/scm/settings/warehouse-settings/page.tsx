"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import {
    Save, Warehouse, Boxes, ArrowRightLeft, LayoutGrid, ArrowRight, Info,
    CheckCircle2, AlertCircle, Building2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import { useScmWarehouseOpsStore } from "@/shared/data/scm/scm-warehouse-ops-store"

export default function WarehouseSettingsPage() {
    const { toast } = useToast()
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const bins = useScmWarehouseOpsStore((s) => s.bins)
    const transfers = useScmWarehouseOpsStore((s) => s.transfers)

    const [defaultWarehouse, setDefaultWarehouse] = useState(warehouses[0]?.warehouseName ?? "")
    const [codeFormat, setCodeFormat] = useState("WH-{NUM}")
    const [enableBin, setEnableBin] = useState(true)
    const [enableMulti, setEnableMulti] = useState(true)
    const [enableApproval, setEnableApproval] = useState(false)

    const summary = useMemo(() => {
        const active = warehouses.filter((w) => w.status === "Active")
        const totalCapacity = warehouses.reduce((s, w) => s + w.storageCapacity, 0)
        const totalUsed = warehouses.reduce((s, w) => s + w.currentUtilization, 0)
        const avgUtil = totalCapacity ? Math.round((totalUsed / totalCapacity) * 100) : 0
        return {
            total: warehouses.length,
            active: active.length,
            inactive: warehouses.length - active.length,
            avgUtil,
            totalCapacity,
            totalUsed,
            binsTracked: bins.length,
            transfersPending: transfers.filter((t) => t.status !== "Received" && t.status !== "Cancelled").length,
        }
    }, [warehouses, bins, transfers])

    const onSave = () => {
        toast({ title: "Settings saved", description: "Warehouse preferences updated." })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Warehouse Settings</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Configure warehouse-level defaults and behaviours.</p>
                </div>
                <Button onClick={onSave} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Save className="w-4 h-4 mr-1.5" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left — Settings panel (2/3) */}
                <div className="lg:col-span-2 space-y-4">
                    <div
                        className="rounded-xl border shadow-sm overflow-hidden"
                        style={{
                            background: "linear-gradient(180deg, #2563eb0d 0%, #ffffff 50%)",
                            borderColor: "#2563eb26",
                        }}
                    >
                        <div className="px-5 py-3.5 border-b flex items-start gap-2" style={{ borderColor: "#2563eb22" }}>
                            <span className="w-1 h-9 rounded-full shrink-0 bg-blue-500" />
                            <div>
                                <h2 className="text-[14px] font-semibold text-[#0F172A]">General</h2>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Defaults applied across the warehouse module.</p>
                            </div>
                        </div>
                        <div className="divide-y divide-[#F1F5F9]">
                            <Row
                                label="Default Warehouse"
                                description="Selected by default when creating new products or stock movements."
                            >
                                <Select value={defaultWarehouse} onValueChange={setDefaultWarehouse}>
                                    <SelectTrigger className="h-10 w-[220px] border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((w) => (<SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </Row>
                            <Row
                                label="Warehouse Code Format"
                                description="Auto-generation pattern for new warehouse codes. Use {NUM} as the running number."
                            >
                                <Input value={codeFormat} onChange={(e) => setCodeFormat(e.target.value)} className="h-10 w-[220px] border-[#E5E7EB] text-[13px]" />
                            </Row>
                        </div>
                    </div>

                    <div
                        className="rounded-xl border shadow-sm overflow-hidden"
                        style={{
                            background: "linear-gradient(180deg, #10b9810d 0%, #ffffff 50%)",
                            borderColor: "#10b98126",
                        }}
                    >
                        <div className="px-5 py-3.5 border-b flex items-start gap-2" style={{ borderColor: "#10b98122" }}>
                            <span className="w-1 h-9 rounded-full shrink-0 bg-emerald-500" />
                            <div>
                                <h2 className="text-[14px] font-semibold text-[#0F172A]">Operations</h2>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Toggles that change how warehouse data behaves.</p>
                            </div>
                        </div>
                        <div className="divide-y divide-[#F1F5F9]">
                            <Row
                                label="Enable Bin / Rack Tracking"
                                description="Track stock at bin and rack level inside each warehouse."
                            >
                                <Switch checked={enableBin} onCheckedChange={setEnableBin} />
                            </Row>
                            <Row
                                label="Enable Multi-Warehouse"
                                description="Allow products to be stored in more than one warehouse."
                            >
                                <Switch checked={enableMulti} onCheckedChange={setEnableMulti} />
                            </Row>
                            <Row
                                label="Require Approval for Warehouse Changes"
                                description="Edits and deletes need an approver before taking effect."
                            >
                                <Switch checked={enableApproval} onCheckedChange={setEnableApproval} />
                            </Row>
                        </div>
                    </div>
                </div>

                {/* Right — Summary + quick links (1/3) */}
                <div className="space-y-4">
                    {/* Warehouse summary */}
                    <div
                        className="rounded-xl border shadow-sm overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #0ea5e914 0%, #0ea5e906 45%, #ffffff 100%)",
                            borderColor: "#0ea5e933",
                        }}
                    >
                        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#0ea5e922" }}>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 bg-sky-500 shadow-sm">
                                <Building2 className="w-4 h-4" />
                            </span>
                            <div>
                                <h3 className="text-[13.5px] font-semibold text-[#0F172A]">Warehouse Summary</h3>
                                <p className="text-[11px] text-[#94A3B8]">Live snapshot</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Stat label="Total" value={summary.total} color="#0ea5e9" />
                                <Stat label="Active" value={summary.active} color="#10b981" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-[11.5px] text-[#64748B] mb-1">
                                    <span>Average Utilization</span>
                                    <span className="font-semibold tabular-nums text-[#0F172A]">{summary.avgUtil}%</span>
                                </div>
                                <Progress value={summary.avgUtil} className="h-1.5" />
                                <p className="text-[11px] text-[#94A3B8] mt-1 tabular-nums">
                                    {summary.totalUsed.toLocaleString()} / {summary.totalCapacity.toLocaleString()} units
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9]">
                                <Stat label="Bins Tracked" value={summary.binsTracked} color="#8b5cf6" />
                                <Stat label="Transfers Open" value={summary.transfersPending} color="#f59e0b" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div
                        className="rounded-xl border shadow-sm overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #8b5cf614 0%, #8b5cf606 45%, #ffffff 100%)",
                            borderColor: "#8b5cf633",
                        }}
                    >
                        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#8b5cf622" }}>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 bg-violet-500 shadow-sm">
                                <Warehouse className="w-4 h-4" />
                            </span>
                            <div>
                                <h3 className="text-[13.5px] font-semibold text-[#0F172A]">Quick Links</h3>
                                <p className="text-[11px] text-[#94A3B8]">Manage warehouse data</p>
                            </div>
                        </div>
                        <ul className="divide-y divide-[#F1F5F9]">
                            <QuickLink href="/scm/warehouses/list" icon={<Building2 className="w-3.5 h-3.5" />} title="Warehouse List" subtitle="Add or edit warehouses" />
                            <QuickLink href="/scm/warehouses/bin-rack" icon={<LayoutGrid className="w-3.5 h-3.5" />} title="Bin / Rack Management" subtitle="Storage zones inside warehouses" />
                            <QuickLink href="/scm/warehouses/transfers" icon={<ArrowRightLeft className="w-3.5 h-3.5" />} title="Warehouse Transfers" subtitle="Move stock between warehouses" />
                            <QuickLink href="/scm/warehouses/activity-logs" icon={<Boxes className="w-3.5 h-3.5" />} title="Activity Logs" subtitle="Audit trail" />
                        </ul>
                    </div>

                    {/* Hint */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-[12px] text-blue-900 leading-relaxed">
                            Changes take effect immediately. Disabling <strong>Multi-Warehouse</strong> will not delete existing assignments — products will simply default to a single warehouse going forward.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Row({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-[#0F172A]">{label}</p>
                <p className="text-[12.5px] text-[#64748B] mt-0.5">{description}</p>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div>
            <p className="text-[11px] uppercase tracking-wide font-semibold text-[#94A3B8]">{label}</p>
            <p className="text-[18px] font-semibold mt-0.5 tabular-nums leading-tight" style={{ color }}>{value}</p>
        </div>
    )
}

function QuickLink({ href, icon, title, subtitle }: { href: string; icon: React.ReactNode; title: string; subtitle: string }) {
    return (
        <li>
            <Link
                href={href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50/40 transition-colors group"
            >
                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-violet-100 text-violet-700 shrink-0">
                    {icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-[#0F172A] truncate">{title}</p>
                    <p className="text-[11px] text-[#94A3B8] truncate">{subtitle}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
        </li>
    )
}
