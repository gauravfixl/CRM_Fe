"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Plus, Send, Phone, RefreshCw } from "lucide-react"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"
import { PageHeader, Stat, FilterBar, ListTable, type ListItemBase } from "@/shared/components/lead-management/sheets/IntegrationListBits"

interface Channel extends ListItemBase, Partial<IntegrationFormShape> {
    sentToday: number
    deliveryRate: number
}

const PROVIDERS = ["Twilio", "SendGrid", "Mailgun", "WhatsApp Business", "Telnyx", "Plivo", "Postmark", "Amazon SES", "Other"]
const ACCENT = "#0ea5e9"

const INITIAL: Channel[] = [
    { id: "CH-001", integrationName: "Twilio SMS", provider: "Twilio", sentToday: 1240, deliveryRate: 98, integrationStatus: "Active", lastSync: "1m ago" },
    { id: "CH-002", integrationName: "SendGrid Transactional", provider: "SendGrid", sentToday: 8420, deliveryRate: 97, integrationStatus: "Active", lastSync: "3m ago" },
    { id: "CH-003", integrationName: "WhatsApp Business", provider: "WhatsApp Business", sentToday: 320, deliveryRate: 99, integrationStatus: "Active", lastSync: "2m ago" },
    { id: "CH-004", integrationName: "Mailgun Bulk", provider: "Mailgun", sentToday: 0, deliveryRate: 0, integrationStatus: "Paused", lastSync: "5d ago" },
]

export default function CommunicationsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [items, setItems] = useState<Channel[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [providerFilter, setProviderFilter] = useState("all")
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<Channel | null>(null)
    const [deleting, setDeleting] = useState<Channel | null>(null)

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
        sentToday: items.reduce((acc, i) => acc + i.sentToday, 0),
        avgDelivery: items.length === 0 ? 0 : Math.round(items.reduce((acc, i) => acc + i.deliveryRate, 0) / items.length),
    }), [items])

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i))
            toast({ title: "Channel updated", description: data.integrationName })
        } else {
            setItems((prev) => [{
                id: `CH-${String(items.length + 1).padStart(3, "0")}`,
                ...data, sentToday: 0, deliveryRate: 0, lastSync: "Never",
            }, ...prev])
            toast({ title: "Channel connected", description: data.integrationName })
        }
        setFormOpen(false); setEditing(null)
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<MessageSquare className="h-5 w-5" />}
                title="Communication Channels"
                description="SMS, email and chat providers used to deliver outbound messages and capture inbound replies."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
                primaryLabel="Connect Channel"
                primaryIcon={<Plus className="h-4 w-4" />}
                onPrimary={() => { setEditing(null); setFormOpen(true) }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Channels" value={stats.total} accent={ACCENT} icon={<MessageSquare className="w-4 h-4" />} />
                <Stat label="Active" value={stats.active} accent="#10b981" icon={<RefreshCw className="w-4 h-4" />} />
                <Stat label="Sent Today" value={stats.sentToday.toLocaleString()} accent="#3b82f6" icon={<Send className="w-4 h-4" />} />
                <Stat label="Avg Delivery" value={`${stats.avgDelivery}%`} accent="#f59e0b" icon={<Phone className="w-4 h-4" />} />
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
                    { key: "sent", label: "Sent Today", align: "right", render: (i) => <span className="tabular-nums font-semibold">{i.sentToday.toLocaleString()}</span> },
                    { key: "delivery", label: "Delivery", align: "right", render: (i) => <span className="tabular-nums text-emerald-700 font-semibold">{i.deliveryRate}%</span> },
                ]}
                onEdit={(i) => { setEditing(i); setFormOpen(true) }}
                onDelete={(i) => setDeleting(i)}
                onTest={(i) => toast({ title: "Test message sent", description: `Verification ping sent through ${i.integrationName}.` })}
                accentBg="bg-sky-50" accentText="text-sky-600" accentBorder="border-sky-100"
                rowIcon={<MessageSquare className="w-3.5 h-3.5" />}
            />

            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDERS}
                onSubmit={handleSubmit}
                accentColor={ACCENT}
                title={editing ? "Edit Channel" : "Connect Communication Channel"}
                description="Configure SMS / Email / WhatsApp gateway with credentials and webhook URL."
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return
                    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
                    toast({ title: "Channel disconnected", description: deleting.integrationName })
                    setDeleting(null)
                }}
                title="Disconnect this channel?"
                description="Outbound messages through this channel will stop immediately."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}
