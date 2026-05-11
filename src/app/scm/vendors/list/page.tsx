"use client"

import * as React from "react"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Download, Users, Star } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { VendorForm } from "@/shared/components/scm/forms/VendorForm"
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"
import {
    useScmVendorsStore,
    type ScmVendor,
} from "@/shared/data/scm/scm-vendors-store"

export default function VendorsListPage() {
    return (
        <Suspense fallback={null}>
            <VendorsListPageInner />
        </Suspense>
    )
}

function VendorsListPageInner() {
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()

    const vendors = useScmVendorsStore((s) => s.vendors)
    const deleteVendor = useScmVendorsStore((s) => s.deleteVendor)

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmVendor | null>(null)
    const [viewing, setViewing] = useState<ScmVendor | null>(null)
    const [deleting, setDeleting] = useState<ScmVendor | null>(null)

    // Sidebar's "Add Vendor" route ?action=add → auto-open form once
    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setEditing(null)
            setFormMode("create")
            setFormOpen(true)
            // Clean the URL so refresh doesn't re-open
            router.replace("/scm/vendors/list", { scroll: false })
        }
    }, [searchParams, router])

    const columns = useMemo<DataTableColumn<ScmVendor>[]>(
        () => [
            {
                key: "vendorCode",
                header: "Code",
                width: "110px",
                sortable: true,
                render: (r) => <span className="font-semibold text-[#0F172A]">{r.vendorCode}</span>,
            },
            {
                key: "vendorName",
                header: "Vendor",
                sortable: true,
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.vendorName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.category}</p>
                    </div>
                ),
            },
            {
                key: "contactPerson",
                header: "Contact",
                sortable: true,
                width: "200px",
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.contactPerson}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.phone}</p>
                    </div>
                ),
            },
            {
                key: "city",
                header: "City",
                sortable: true,
                width: "140px",
                render: (r) => (
                    <span className="text-[#0F172A]">{r.city}, {r.state}</span>
                ),
            },
            {
                key: "rating",
                header: "Rating",
                sortable: true,
                width: "100px",
                align: "right",
                render: (r) => (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0F172A] tabular-nums">
                        {r.rating.toFixed(1)}
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </span>
                ),
            },
            {
                key: "paymentTerms",
                header: "Terms",
                width: "100px",
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
    const handleEdit = (v: ScmVendor) => {
        setEditing(v)
        setFormMode("edit")
        setFormOpen(true)
    }
    const confirmDelete = () => {
        if (!deleting) return
        deleteVendor(deleting.id)
        toast({ title: "Vendor deleted", description: deleting.vendorName })
        setDeleting(null)
    }
    const handleExport = () => {
        if (vendors.length === 0) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Code", "Vendor Name", "Category", "Contact", "Phone", "Email", "City", "State", "GSTIN", "Payment Terms", "Rating", "Status"]
        const rows = vendors.map((v) => [v.vendorCode, v.vendorName, v.category, v.contactPerson, v.phone, v.email, v.city, v.state, v.gstin, v.paymentTerms, v.rating, v.status])
        const escape = (val: any) => {
            const s = String(val ?? "")
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `scm-vendors-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} vendors exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Vendors</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Manage suppliers, vendors, and their contact information.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Vendor
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={vendors}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by name, code, contact, city..."
                searchKeys={["vendorName", "vendorCode", "contactPerson", "city", "category", "email"]}
                pageSize={10}
                emptyMessage="No vendors yet. Click 'Add Vendor' to register one."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions
                        onView={() => setViewing(row)}
                        onEdit={() => handleEdit(row)}
                        onDelete={() => setDeleting(row)}
                    />
                )}
            />

            <VendorForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={formMode} />

            <SideFormSheet
                open={!!viewing}
                onOpenChange={(o) => !o && setViewing(null)}
                title={viewing?.vendorName ?? "Vendor"}
                description={viewing ? `Code ${viewing.vendorCode}` : undefined}
                icon={<Users className="w-5 h-5" />}
                hideFooter
                width="lg"
                accentColor="#8b5cf6"
            >
                {viewing && (
                    <div className="space-y-5">
                        <Section title="Basic">
                            <Cell label="Category" value={viewing.category} />
                            <Cell label="Status" value={<StatusBadge status={viewing.status} />} />
                            <Cell label="Payment Terms" value={viewing.paymentTerms} />
                            <Cell
                                label="Rating"
                                value={
                                    <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                                        {viewing.rating.toFixed(1)}
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    </span>
                                }
                            />
                        </Section>
                        <Section title="Contact">
                            <Cell label="Contact Person" value={viewing.contactPerson} />
                            <Cell label="Phone" value={viewing.phone} />
                            <Cell label="Email" value={viewing.email} />
                            <Cell label="Website" value={viewing.website || "—"} />
                            <Cell label="GSTIN" value={viewing.gstin || "—"} />
                        </Section>
                        <Section title="Address">
                            <Cell label="City" value={viewing.city} />
                            <Cell label="State" value={viewing.state} />
                            <Cell label="Country" value={viewing.country} />
                            <Cell label="Pincode" value={viewing.pincode} />
                            <div className="col-span-2">
                                <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">Address</dt>
                                <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium whitespace-pre-wrap">{viewing.address}</dd>
                            </div>
                        </Section>
                        <Section title="Banking">
                            <Cell label="Bank" value={viewing.bankName || "—"} />
                            <Cell label="Account" value={viewing.accountNumber || "—"} />
                            <Cell label="IFSC" value={viewing.ifsc || "—"} />
                            <Cell label="Created" value={viewing.createdAt} />
                        </Section>
                    </div>
                )}
            </SideFormSheet>

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Delete this vendor?"
                itemLabel={deleting ? `${deleting.vendorName} (${deleting.vendorCode})` : ""}
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
