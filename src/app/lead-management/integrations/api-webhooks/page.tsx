"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Webhook, Plus, Activity, AlertCircle, Send } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface WebhookEntry extends ListItemBase, Partial<IntegrationFormShape> {
    requests: number
    errors: number
}

const PROVIDERS = ["Inbound Webhook", "Outbound Webhook", "REST API", "GraphQL", "Zapier", "Make.com", "n8n", "Custom"]
const ACCENT = "#6366f1"

const INITIAL: WebhookEntry[] = [
    { id: "WH-001", integrationName: "Lead Form Webhook", provider: "Inbound Webhook", endpointUrl: "https://api.cubicleerp.com/webhooks/leads", requests: 12450, errors: 0, integrationStatus: "Active", lastSync: "1m ago" },
    { id: "WH-002", integrationName: "Stripe Customer Push", provider: "Outbound Webhook", endpointUrl: "https://hooks.stripe.com/v1/customers", requests: 4200, errors: 8, integrationStatus: "Active", lastSync: "3m ago" },
    { id: "WH-003", integrationName: "Zapier Multi-Step", provider: "Zapier", endpointUrl: "https://hooks.zapier.com/abc123", requests: 880, errors: 24, integrationStatus: "Paused", lastSync: "1d ago" },
]

export default function ApiWebhooksPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<WebhookEntry[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<WebhookEntry | null>(null)
    const [deleting, setDeleting] = useState<WebhookEntry | null>(null)

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return items.filter((i) => {
            if (statusFilter !== "all" && i.integrationStatus !== statusFilter) return false
            if (providerFilter !== "all" && i.provider !== providerFilter) return false
            if (!q) return true
            return i.integrationName.toLowerCase().includes(q) || i.provider.toLowerCase().includes(q) || (i.endpointUrl ?? "").toLowerCase().includes(q)
        })
    }, [items, search, statusFilter, providerFilter])

    const stats = useMemo(() => ({
        total: items.length,
        active: items.filter((i) => i.integrationStatus === "Active").length,
        requests: items.reduce((acc, i) => acc + i.requests, 0),
        errors: items.reduce((acc, i) => acc + i.errors, 0),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "Webhook updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `WH-${String(items.length + 1).padStart(3, "0")}`,
                ...data, requests: 0, errors: 0, lastSync: "Never",
            }, ...prev])
            toast({ title: "Webhook created", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<Webhook className="h-5 w-5" />}
                title="API & Webhooks"
                description="Inbound and outbound webhook endpoints + REST API integrations driving real-time data flow."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Create Webhook"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Endpoints" value={stats.total} accent={ACCENT} icon={<Webhook className="w-4 h-4" />} />
                <Stat label="Active" value={stats.active} accent="#10b981" icon={<Activity className="w-4 h-4" />} />
                <Stat label="Total Requests" value={stats.requests.toLocaleString()} accent="#3b82f6" icon={<Send className="w-4 h-4" />} />
                <Stat label="Error Count" value={stats.errors} accent="#ef4444" icon={<AlertCircle className="w-4 h-4" />} helper={stats.errors === 0 ? "all healthy" : "investigate"} />
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
                    { key: "endpoint", label: "Endpoint", render: (i) => (
                        <span className="font-mono text-[11px] text-[#475569] truncate block max-w-[280px]">{i.endpointUrl ?? "—"}</span>
                    ) },
                    { key: "requests", label: "Requests", align: "right", render: (i) => <span className="tabular-nums font-semibold">{i.requests.toLocaleString()}</span> },
                    { key: "errors", label: "Errors", align: "right", render: (i) => (
                        <span className={`tabular-nums font-semibold ${i.errors === 0 ? "text-emerald-700" : "text-red-700"}`}>{i.errors}</span>
                    ) },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Test payload sent", description: `Synthetic event dispatched to ${i.integrationName}.` })}
                accentBg="bg-indigo-50" accentText="text-indigo-600" accentBorder="border-indigo-100"
                rowIcon={<Webhook className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit Webhook" : "Create Webhook"}
                description="Configure endpoint URL, optional secret signature and direction."
                requiredFields={["integrationName", "provider", "endpointUrl", "integrationStatus"]}
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "Webhook removed", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Remove this webhook?"
                description="The endpoint will stop receiving / sending events immediately."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
