"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, Warehouse } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { WarehouseForm } from "@/shared/components/scm/forms/WarehouseForm"
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"
import {
    useScmWarehousesStore,
    type ScmWarehouse,
} from "@/shared/data/scm/scm-warehouses-store"

export default function WarehousesPage() {
    const { toast } = useToast()
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const deleteWarehouse = useScmWarehousesStore((s) => s.deleteWarehouse)

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmWarehouse | null>(null)
    const [viewing, setViewing] = useState<ScmWarehouse | null>(null)
    const [deleting, setDeleting] = useState<ScmWarehouse | null>(null)

    const utilizationPct = (w: ScmWarehouse) =>
        w.storageCapacity ? Math.round((w.currentUtilization / w.storageCapacity) * 100) : 0

    const columns = useMemo<DataTableColumn<ScmWarehouse>[]>(
        () => [
            {
                key: "warehouseCode",
                header: "Code",
                width: "110px",
                sortable: true,
                render: (r) => <span className="font-semibold text-[#0F172A]">{r.warehouseCode}</span>,
            },
            {
                key: "warehouseName",
                header: "Name",
                sortable: true,
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.warehouseName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">
                            {r.city}, {r.state}
                        </p>
                    </div>
                ),
            },
            {
                key: "managerName",
                header: "Manager",
                sortable: true,
                width: "180px",
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.managerName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.contact}</p>
                    </div>
                ),
            },
            {
                key: "utilization",
                header: "Utilization",
                width: "200px",
                accessor: (r) => utilizationPct(r),
                sortable: true,
                render: (r) => {
                    const pct = utilizationPct(r)
                    return (
                        <div>
                            <div className="flex items-center justify-between text-[11.5px] text-[#64748B] mb-0.5">
                                <span>
                                    {r.currentUtilization.toLocaleString()} /{" "}
                                    {r.storageCapacity.toLocaleString()}
                                </span>
                                <span className="font-semibold tabular-nums text-[#0F172A]">{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                        </div>
                    )
                },
            },
            {
                key: "status",
                header: "Status",
                width: "100px",
                render: (r) => <StatusBadge status={r.status} />,
            },
        ],
        []
    )

    const handleAdd = () => {
        setEditing(null)
        setFormMode("create")
        setFormOpen(true)
    }
    const handleEdit = (w: ScmWarehouse) => {
        setEditing(w)
        setFormMode("edit")
        setFormOpen(true)
    }
    const confirmDelete = () => {
        if (!deleting) return
        deleteWarehouse(deleting.id)
        toast({ title: "Warehouse deleted", description: deleting.warehouseName })
        setDeleting(null)
    }

    const handleExport = () => {
        if (warehouses.length === 0) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Code", "Name", "Address", "City", "State", "Pincode", "Manager", "Contact", "Capacity", "Utilization", "Status"]
        const rows = warehouses.map((w) => [w.warehouseCode, w.warehouseName, w.address, w.city, w.state, w.pincode, w.managerName, w.contact, w.storageCapacity, w.currentUtilization, w.status])
        const escape = (v: any) => {
            const s = String(v ?? "")
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `scm-warehouses-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} warehouses exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Warehouses</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Manage warehouse locations and capacity.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#0ea5e9", boxShadow: "0 4px 12px #0ea5e933" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Warehouse
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={warehouses}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by name, code, city, manager..."
                searchKeys={["warehouseName", "warehouseCode", "city", "state", "managerName"]}
                pageSize={10}
                emptyMessage="No warehouses yet. Click 'Add Warehouse' to register one."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions
                        onView={() => setViewing(row)}
                        onEdit={() => handleEdit(row)}
                        onDelete={() => setDeleting(row)}
                    />
                )}
            />

            <WarehouseForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={formMode} />

            <SideFormSheet
                open={!!viewing}
                onOpenChange={(o) => !o && setViewing(null)}
                title={viewing?.warehouseName ?? "Warehouse"}
                description={viewing ? `Code ${viewing.warehouseCode}` : undefined}
                icon={<Warehouse className="w-5 h-5" />}
                hideFooter
                width="lg"
                accentColor="#0ea5e9"
            >
                {viewing && (
                    <div className="space-y-5">
                        <Section title="Basic Information">
                            <Cell label="Warehouse Name" value={viewing.warehouseName} />
                            <Cell label="Warehouse Code" value={<span className="font-mono">{viewing.warehouseCode}</span>} />
                            <Cell label="Status" value={<StatusBadge status={viewing.status} />} />
                            <Cell label="Created" value={viewing.createdAt} />
                        </Section>

                        <Section title="Location & Address">
                            <div className="col-span-2">
                                <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">Address</dt>
                                <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium whitespace-pre-wrap">{viewing.address}</dd>
                            </div>
                            <Cell label="City" value={viewing.city} />
                            <Cell label="State" value={viewing.state} />
                            <Cell label="Country" value={viewing.country} />
                            <Cell label="Pincode" value={viewing.pincode} />
                        </Section>

                        <Section title="Manager">
                            <Cell label="Manager Name" value={viewing.managerName} />
                            <Cell label="Manager Contact" value={viewing.contact} />
                        </Section>

                        <div>
                            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">Capacity & Utilization</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                                <Cell label="Storage Capacity" value={<span className="tabular-nums">{viewing.storageCapacity.toLocaleString()} units</span>} />
                                <Cell label="Current Utilization" value={<span className="tabular-nums">{viewing.currentUtilization.toLocaleString()} units</span>} />
                                <Cell label="Available Space" value={<span className="tabular-nums">{(viewing.storageCapacity - viewing.currentUtilization).toLocaleString()} units</span>} />
                                <Cell label="Utilization %" value={<span className="tabular-nums font-semibold">{utilizationPct(viewing)}%</span>} />
                                <div className="col-span-2 mt-1">
                                    <div className="flex items-center justify-between text-[11.5px] text-[#64748B] mb-1">
                                        <span>Utilization</span>
                                        <span className="font-semibold tabular-nums text-[#0F172A]">{utilizationPct(viewing)}%</span>
                                    </div>
                                    <Progress value={utilizationPct(viewing)} className="h-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SideFormSheet>

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Delete this warehouse?"
                itemLabel={deleting ? `${deleting.warehouseName} (${deleting.warehouseCode})` : ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">{title}</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">{children}</dl>
        </div>
    )
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">{label}</dt>
            <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium">{value}</dd>
        </div>
    )
}
