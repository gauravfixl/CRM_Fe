"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Target, Plus, Eye, MousePointerClick, TrendingUp } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface TrackingPixel extends ListItemBase, Partial<IntegrationFormShape> {
    pageviews: number
    events: number
}

const PROVIDERS = ["Google Analytics 4", "Google Tag Manager", "Meta Pixel", "LinkedIn Insight", "TikTok Pixel", "Hotjar", "Clarity", "Mixpanel", "Amplitude", "Other"]
const ACCENT = "#a855f7"

const INITIAL: TrackingPixel[] = [
    { id: "TR-001", integrationName: "GA4 Production", provider: "Google Analytics 4", pageviews: 1240000, events: 4200, integrationStatus: "Active", lastSync: "Real-time" },
    { id: "TR-002", integrationName: "Meta Pixel", provider: "Meta Pixel", pageviews: 880000, events: 2100, integrationStatus: "Active", lastSync: "Real-time" },
    { id: "TR-003", integrationName: "GTM Container", provider: "Google Tag Manager", pageviews: 0, events: 0, integrationStatus: "Active", lastSync: "Real-time" },
    { id: "TR-004", integrationName: "LinkedIn Insight", provider: "LinkedIn Insight", pageviews: 45000, events: 320, integrationStatus: "Paused", lastSync: "1d ago" },
]

export default function TrackingPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<TrackingPixel[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<TrackingPixel | null>(null)
    const [deleting, setDeleting] = useState<TrackingPixel | null>(null)

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
        pageviews: items.reduce((acc, i) => acc + i.pageviews, 0),
        events: items.reduce((acc, i) => acc + i.events, 0),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "Tracker updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `TR-${String(items.length + 1).padStart(3, "0")}`,
                ...data, pageviews: 0, events: 0, lastSync: "Real-time",
            }, ...prev])
            toast({ title: "Tracker installed", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<Target className="h-5 w-5" />}
                title="Tracking & Pixels"
                description="Analytics, conversion pixels and tag managers for site-wide event tracking and attribution."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Install Pixel"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Trackers" value={stats.total} accent={ACCENT} icon={<Target className="w-4 h-4" />} />
                <Stat label="Active" value={stats.active} accent="#10b981" icon={<TrendingUp className="w-4 h-4" />} />
                <Stat label="Page Views" value={stats.pageviews.toLocaleString()} accent="#3b82f6" icon={<Eye className="w-4 h-4" />} helper="last 30 days" />
                <Stat label="Conversion Events" value={stats.events.toLocaleString()} accent="#f59e0b" icon={<MousePointerClick className="w-4 h-4" />} />
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
                    { key: "pageviews", label: "Page Views", align: "right", render: (i) => <span className="tabular-nums font-semibold">{i.pageviews.toLocaleString()}</span> },
                    { key: "events", label: "Events", align: "right", render: (i) => <span className="tabular-nums">{i.events.toLocaleString()}</span> },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Test event fired", description: `Sample conversion event sent to ${i.integrationName}.` })}
                accentBg="bg-purple-50" accentText="text-purple-600" accentBorder="border-purple-100"
                rowIcon={<Target className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit Tracker" : "Install Tracking Pixel"}
                description="Add tracking ID / pixel ID and configure what events to capture."
                hideFields={["webhookUrl", "secretKey"]}
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "Tracker removed", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Remove this tracker?"
                description="The pixel will stop firing. Past analytics data is preserved with the provider."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
