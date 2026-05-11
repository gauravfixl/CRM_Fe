"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Plus, Users, BarChart3, RefreshCw } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface MarketingPlatform extends ListItemBase, Partial<IntegrationFormShape> {
    contacts: number
    campaigns: number
}

const PROVIDERS = ["Mailchimp", "HubSpot", "Marketo", "Pardot", "ActiveCampaign", "Klaviyo", "Constant Contact", "ConvertKit", "Brevo", "Other"]
const ACCENT = "#ec4899"

const INITIAL: MarketingPlatform[] = [
    { id: "MKT-001", integrationName: "Mailchimp Production", provider: "Mailchimp", contacts: 12450, campaigns: 24, integrationStatus: "Active", lastSync: "5m ago" },
    { id: "MKT-002", integrationName: "HubSpot CRM Sync", provider: "HubSpot", contacts: 8200, campaigns: 17, integrationStatus: "Active", lastSync: "12m ago" },
    { id: "MKT-003", integrationName: "Marketo Enterprise", provider: "Marketo", contacts: 22100, campaigns: 48, integrationStatus: "Paused", lastSync: "3d ago" },
]

export default function MarketingPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<MarketingPlatform[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<MarketingPlatform | null>(null)
    const [deleting, setDeleting] = useState<MarketingPlatform | null>(null)

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
        contacts: items.reduce((acc, i) => acc + i.contacts, 0),
        campaigns: items.reduce((acc, i) => acc + i.campaigns, 0),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "Platform updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `MKT-${String(items.length + 1).padStart(3, "0")}`,
                ...data, contacts: 0, campaigns: 0, lastSync: "Never",
            }, ...prev])
            toast({ title: "Platform connected", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<Mail className="h-5 w-5" />}
                title="Marketing Platforms"
                description="Connect email marketing, automation and nurture platforms to sync contacts and campaign data."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Connect Platform"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Connected" value={stats.total} accent={ACCENT} icon={<Mail className="w-4 h-4" />} />
                <Stat label="Active Sync" value={stats.active} accent="#10b981" icon={<RefreshCw className="w-4 h-4" />} />
                <Stat label="Total Contacts" value={stats.contacts.toLocaleString()} accent="#3b82f6" icon={<Users className="w-4 h-4" />} />
                <Stat label="Active Campaigns" value={stats.campaigns} accent="#f59e0b" icon={<BarChart3 className="w-4 h-4" />} />
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
                    { key: "contacts", label: "Contacts", align: "right", render: (i) => <span className="tabular-nums font-semibold">{i.contacts.toLocaleString()}</span> },
                    { key: "campaigns", label: "Campaigns", align: "right", render: (i) => <span className="tabular-nums">{i.campaigns}</span> },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Sync triggered", description: `Manual sync sent to ${i.integrationName}.` })}
                accentBg="bg-pink-50" accentText="text-pink-600" accentBorder="border-pink-100"
                rowIcon={<Mail className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit Marketing Platform" : "Connect Marketing Platform"}
                description="Connect an email/automation provider with API credentials."
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "Platform disconnected", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Disconnect this platform?"
                description="Sync will stop immediately. Existing contact data is preserved."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
