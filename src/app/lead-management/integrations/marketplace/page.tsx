"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Store, Plus, Package, Star, Download } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface Plugin extends ListItemBase, Partial<IntegrationFormShape> {
    version: string
    rating: number
    installs: number
}

const PROVIDERS = ["Cubicle Marketplace", "GitHub", "NPM Registry", "Internal", "Third Party", "Custom"]
const ACCENT = "#f97316"

const INITIAL: Plugin[] = [
    { id: "MP-001", integrationName: "Calendly Booking Plugin", provider: "Cubicle Marketplace", version: "2.4.1", rating: 4.8, installs: 8200, integrationStatus: "Active", lastSync: "1d ago" },
    { id: "MP-002", integrationName: "DocuSign Connector", provider: "Cubicle Marketplace", version: "1.9.2", rating: 4.6, installs: 5400, integrationStatus: "Active", lastSync: "3d ago" },
    { id: "MP-003", integrationName: "Slack Notifier", provider: "Cubicle Marketplace", version: "3.0.0", rating: 4.9, installs: 12400, integrationStatus: "Active", lastSync: "1h ago" },
    { id: "MP-004", integrationName: "Custom AI Scorer", provider: "Internal", version: "0.8.0-beta", rating: 4.2, installs: 120, integrationStatus: "Paused", lastSync: "5d ago" },
]

export default function MarketplacePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<Plugin[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<Plugin | null>(null)
    const [deleting, setDeleting] = useState<Plugin | null>(null)

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
        avgRating: items.length === 0 ? 0 : (items.reduce((acc, i) => acc + i.rating, 0) / items.length).toFixed(1),
        installs: items.reduce((acc, i) => acc + i.installs, 0),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "Plugin updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `MP-${String(items.length + 1).padStart(3, "0")}`,
                ...data, version: "1.0.0", rating: 0, installs: 0, lastSync: "Just now",
            }, ...prev])
            toast({ title: "Plugin installed", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<Store className="h-5 w-5" />}
                title="Marketplace"
                description="Plugins and add-ons that extend the lead-management platform with third-party capabilities."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Install Plugin"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Installed" value={stats.total} accent={ACCENT} icon={<Package className="w-4 h-4" />} />
                <Stat label="Active" value={stats.active} accent="#10b981" icon={<Store className="w-4 h-4" />} />
                <Stat label="Avg Rating" value={`${stats.avgRating} ★`} accent="#f59e0b" icon={<Star className="w-4 h-4" />} />
                <Stat label="Total Installs" value={stats.installs.toLocaleString()} accent="#3b82f6" icon={<Download className="w-4 h-4" />} />
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
                    { key: "version", label: "Version", render: (i) => <span className="font-mono text-[11px] text-[#64748B]">v{i.version}</span> },
                    { key: "rating", label: "Rating", align: "right", render: (i) => <span className="tabular-nums font-semibold text-amber-700">{i.rating} ★</span> },
                    { key: "installs", label: "Installs", align: "right", render: (i) => <span className="tabular-nums">{i.installs.toLocaleString()}</span> },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Update check", description: `Checking marketplace for updates to ${i.integrationName}.` })}
                accentBg="bg-orange-50" accentText="text-orange-600" accentBorder="border-orange-100"
                rowIcon={<Package className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit Plugin" : "Install Plugin"}
                description="Choose a marketplace plugin and configure access credentials if required."
                hideFields={["secretKey", "webhookUrl", "direction", "syncFrequency"]}
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "Plugin uninstalled", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Uninstall this plugin?"
                description="The plugin and its configuration will be removed. User-generated data is preserved."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
