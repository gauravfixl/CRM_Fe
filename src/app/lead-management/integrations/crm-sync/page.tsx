"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Database, Plus, RefreshCw, ArrowLeftRight, CheckCircle2 } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface CrmConnection extends ListItemBase, Partial<IntegrationFormShape> {
    syncedRecords: number
    conflicts: number
}

const PROVIDERS = ["Salesforce", "Zoho CRM", "Pipedrive", "Microsoft Dynamics", "SugarCRM", "Freshsales", "Insightly", "Other"]
const ACCENT = "#14b8a6"

const INITIAL: CrmConnection[] = [
    { id: "CRM-001", integrationName: "Salesforce Production", provider: "Salesforce", syncedRecords: 12500, conflicts: 0, integrationStatus: "Active", lastSync: "8m ago", direction: "Bi-directional" },
    { id: "CRM-002", integrationName: "Zoho APAC", provider: "Zoho CRM", syncedRecords: 4200, conflicts: 12, integrationStatus: "Active", lastSync: "15m ago", direction: "Inbound" },
    { id: "CRM-003", integrationName: "Pipedrive Sales Team", provider: "Pipedrive", syncedRecords: 8800, conflicts: 4, integrationStatus: "Paused", lastSync: "2d ago", direction: "Outbound" },
]

export default function CrmSyncPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<CrmConnection[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<CrmConnection | null>(null)
    const [deleting, setDeleting] = useState<CrmConnection | null>(null)

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return items.filter((i) => {
            if (statusFilter !== "all" && i.integrationStatus !== statusFilter) return false
            if (providerFilter !== "all" && i.provider !== providerFilter) return false
            if (!q) return true
            return i.integrationName.toLowerCase().includes(q) || i.provider.toLowerCase().includes(q)
        })
    }, [items, search, statusFilter, providerFilter])

    const stats = useMemo(() => ({
        total: items.length,
        active: items.filter((i) => i.integrationStatus === "Active").length,
        synced: items.reduce((acc, i) => acc + i.syncedRecords, 0),
        conflicts: items.reduce((acc, i) => acc + i.conflicts, 0),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "CRM updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `CRM-${String(items.length + 1).padStart(3, "0")}`,
                ...data, syncedRecords: 0, conflicts: 0, lastSync: "Never",
            }, ...prev])
            toast({ title: "CRM connected", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<Database className="h-5 w-5" />}
                title="CRM & Data Sync"
                description="Bi-directional sync with external CRMs to keep contact and pipeline data in lock-step."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Connect CRM"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Connections" value={stats.total} accent={ACCENT} icon={<Database className="w-4 h-4" />} />
                <Stat label="Active" value={stats.active} accent="#10b981" icon={<CheckCircle2 className="w-4 h-4" />} />
                <Stat label="Records Synced" value={stats.synced.toLocaleString()} accent="#3b82f6" icon={<ArrowLeftRight className="w-4 h-4" />} />
                <Stat label="Open Conflicts" value={stats.conflicts} accent="#ef4444" icon={<RefreshCw className="w-4 h-4" />} helper={stats.conflicts === 0 ? "all clean" : "needs review"} />
            </div>

            <FilterBar
                search={search} onSearch={setSearch}
                statusFilter={statusFilter} onStatusFilter={setStatusFilter}
                providerFilter={providerFilter} onProviderFilter={setProviderFilter}
                providerOptions={PROVIDERS}
                visible={filtered.length} total={items.length}
            />

            <ListTable
                items={filtered}
                columns={[
                    { key: "direction", label: "Direction", render: (i) => (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none border bg-teal-50 text-teal-700 border-teal-200">
                            {i.direction ?? "—"}
                        </span>
                    ) },
                    { key: "synced", label: "Synced", align: "right", render: (i) => <span className="tabular-nums font-semibold">{i.syncedRecords.toLocaleString()}</span> },
                    { key: "conflicts", label: "Conflicts", align: "right", render: (i) => (
                        <span className={`tabular-nums font-semibold ${i.conflicts === 0 ? "text-emerald-700" : "text-red-700"}`}>{i.conflicts}</span>
                    ) },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Sync triggered", description: `Manual sync to ${i.integrationName} dispatched.` })}
                accentBg="bg-teal-50" accentText="text-teal-600" accentBorder="border-teal-100"
                rowIcon={<Database className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit CRM Connection" : "Connect CRM"}
                description="Configure CRM credentials, sync direction and frequency."
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "CRM disconnected", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Disconnect this CRM?"
                description="Sync will stop immediately. Local data is preserved but no longer mirrored."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
