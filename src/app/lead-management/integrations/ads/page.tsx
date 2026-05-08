"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Megaphone, Plus, MousePointerClick, DollarSign, BarChart3 } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface AdAccount extends ListItemBase, Partial<IntegrationFormShape> {
    spend: number
    leads: number
    cpl: number
}

const PROVIDERS = ["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads", "Twitter Ads", "Bing Ads", "Reddit Ads", "Quora Ads", "Other"]
const ACCENT = "#dc2626"

const INITIAL: AdAccount[] = [
    { id: "AD-001", integrationName: "Google Ads — Brand", provider: "Google Ads", spend: 124000, leads: 850, cpl: 146, integrationStatus: "Active", lastSync: "10m ago" },
    { id: "AD-002", integrationName: "Meta Lead Ads", provider: "Meta Ads", spend: 88000, leads: 1240, cpl: 71, integrationStatus: "Active", lastSync: "20m ago" },
    { id: "AD-003", integrationName: "LinkedIn Sponsored", provider: "LinkedIn Ads", spend: 45000, leads: 180, cpl: 250, integrationStatus: "Paused", lastSync: "1d ago" },
]

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function AdsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<AdAccount[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdAccount | null>(null)
    const [deleting, setDeleting] = useState<AdAccount | null>(null)

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
        spend: items.reduce((acc, i) => acc + i.spend, 0),
        leads: items.reduce((acc, i) => acc + i.leads, 0),
        avgCpl: items.length === 0 ? 0 : Math.round(items.reduce((acc, i) => acc + i.cpl, 0) / items.length),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "Ad account updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `AD-${String(items.length + 1).padStart(3, "0")}`,
                ...data, spend: 0, leads: 0, cpl: 0, lastSync: "Never",
            }, ...prev])
            toast({ title: "Ad account connected", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<Megaphone className="h-5 w-5" />}
                title="Ad Platforms"
                description="Connect ad accounts to ingest paid lead-gen forms and sync attribution data."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Connect Ad Account"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Connected" value={stats.total} accent={ACCENT} icon={<Megaphone className="w-4 h-4" />} />
                <Stat label="Total Spend" value={formatINR(stats.spend)} accent="#3b82f6" icon={<DollarSign className="w-4 h-4" />} />
                <Stat label="Leads Captured" value={stats.leads.toLocaleString()} accent="#10b981" icon={<MousePointerClick className="w-4 h-4" />} />
                <Stat label="Avg CPL" value={formatINR(stats.avgCpl)} accent="#f59e0b" icon={<BarChart3 className="w-4 h-4" />} />
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
                    { key: "spend", label: "Spend", align: "right", render: (i) => <span className="tabular-nums font-semibold">{formatINR(i.spend)}</span> },
                    { key: "leads", label: "Leads", align: "right", render: (i) => <span className="tabular-nums">{i.leads.toLocaleString()}</span> },
                    { key: "cpl", label: "CPL", align: "right", render: (i) => <span className="tabular-nums text-blue-700 font-semibold">{formatINR(i.cpl)}</span> },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Refresh dispatched", description: `Pulling latest data from ${i.integrationName}.` })}
                accentBg="bg-red-50" accentText="text-red-600" accentBorder="border-red-100"
                rowIcon={<Megaphone className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit Ad Account" : "Connect Ad Account"}
                description="Connect a paid-media platform to import lead-form submissions and spend data."
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "Ad account disconnected", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Disconnect this ad account?"
                description="Lead capture from this account will stop. Historical data is preserved."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
