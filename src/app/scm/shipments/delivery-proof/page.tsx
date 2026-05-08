"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Camera, FileImage, Upload, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useScmShipmentsStore, type ScmShipment } from "@/shared/data/scm/scm-shipments-store"

const PROOF_TYPES = ["Signature", "Photo", "OTP", "Stamp", "Acknowledgment Note"]

interface ProofFormShape {
    proofType: string
    receivedBy: string
    deliveryRemarks: string
    fileName: string
}

const empty: ProofFormShape = { proofType: "Signature", receivedBy: "", deliveryRemarks: "", fileName: "" }

export default function DeliveryProofPage() {
    const { toast } = useToast()
    const shipments = useScmShipmentsStore((s) => s.shipments)
    const updateShipment = useScmShipmentsStore((s) => s.updateShipment)

    const [editing, setEditing] = useState<ScmShipment | null>(null)
    const [data, setData] = useState<ProofFormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [viewing, setViewing] = useState<ScmShipment | null>(null)

    const delivered = useMemo(() => shipments.filter((s) => s.status === "Delivered"), [shipments])

    useEffect(() => {
        if (editing) setData(empty)
        setErrors({}); setTouched({})
    }, [editing])

    const validate = () => {
        const next: Record<string, string> = {}
        if (!data.proofType) next.proofType = "This field is required"
        if (!data.receivedBy.trim()) next.receivedBy = "This field is required"
        else if (data.receivedBy.trim().length < 2) next.receivedBy = "Minimum 2 characters"
        if (data.deliveryRemarks.length > 500) next.deliveryRemarks = "Maximum 500 characters"
        setErrors(next)
        setTouched({ proofType: true, receivedBy: true, deliveryRemarks: true, fileName: true })
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            if (editing) {
                updateShipment(editing.id, { remarks: `Delivered. Received by ${data.receivedBy}. ${data.deliveryRemarks}`.trim() })
                toast({ title: "Proof uploaded", description: editing.shipmentId })
            }
            setEditing(null)
        } finally { setSubmitting(false) }
    }

    const columns: DataTableColumn<ScmShipment>[] = useMemo(
        () => [
            { key: "shipmentId", header: "Shipment", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.shipmentId}</span> },
            { key: "orderNumber", header: "Order", width: "110px" },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "actualDelivery", header: "Delivered", width: "120px", render: (r) => <span className="tabular-nums">{r.actualDelivery ?? "—"}</span> },
            { key: "remarks", header: "Proof / Notes", render: (r) => <span className="text-[#64748B]">{r.remarks || "—"}</span> },
            { key: "status", header: "Status", width: "120px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleExport = () => {
        if (delivered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Shipment", "Order", "Customer", "Delivered", "Proof / Notes"]
        const rows = delivered.map((s) => [s.shipmentId, s.orderNumber, s.customerName, s.actualDelivery ?? "", s.remarks ?? ""])
        const escape = (v: any) => { const x = String(v ?? ""); return /[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-delivery-proof-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} records exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <FileImage className="w-5 h-5 text-emerald-600" /> Delivery Proof
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Upload proof of delivery for completed shipments.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={delivered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search shipments..."
                searchKeys={["shipmentId", "orderNumber", "customerName"]}
                pageSize={15}
                emptyMessage="No delivered shipments yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <Button onClick={() => setEditing(row)} variant="outline" size="sm" className="h-8 px-2 text-[12px] border-[#E5E7EB]">
                        <Upload className="w-3.5 h-3.5 mr-1" /> Upload Proof
                    </Button>
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.shipmentId}
                description={(r) => `${r.customerName} · Order ${r.orderNumber}`}
                icon={<FileImage className="w-5 h-5" />}
                accentColor="#10b981"
            />

            <SideFormSheet
                open={!!editing}
                onOpenChange={(o) => !o && setEditing(null)}
                title={editing ? `Upload Proof: ${editing.shipmentId}` : "Upload Proof"}
                description="Capture signature, photo, or note as proof of delivery."
                icon={<Camera className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel="Save Proof"
                width="md"
                accentColor="#10b981"
            >
                <div className="space-y-4">
                    <Field label="Proof Type" required error={touched.proofType ? errors.proofType : undefined}>
                        <Select value={data.proofType} onValueChange={(v) => setData((d) => ({ ...d, proofType: v }))}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{PROOF_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Received By" required error={touched.receivedBy ? errors.receivedBy : undefined}>
                        <Input value={data.receivedBy} onChange={(e) => setData((d) => ({ ...d, receivedBy: e.target.value }))} placeholder="Recipient's name" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Upload File" hint="Photo / signature image (optional)">
                        <Input type="file" accept="image/*" onChange={(e) => setData((d) => ({ ...d, fileName: e.target.files?.[0]?.name ?? "" }))} className="h-10 border-[#E5E7EB] text-[13px] file:text-[12px]" />
                        {data.fileName && <p className="text-[11.5px] text-[#64748B] mt-1">Selected: {data.fileName}</p>}
                    </Field>
                    <Field label="Delivery Remarks" error={touched.deliveryRemarks ? errors.deliveryRemarks : undefined}>
                        <Textarea value={data.deliveryRemarks} onChange={(e) => setData((d) => ({ ...d, deliveryRemarks: e.target.value }))} rows={3} placeholder="e.g. Delivered to building reception" className="border-[#E5E7EB] text-[13px] resize-none" />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    )
}
