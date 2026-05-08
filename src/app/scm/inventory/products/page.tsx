"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Pencil, Trash2, Eye, Download, MoreHorizontal, Boxes } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { ProductForm } from "@/shared/components/scm/forms/ProductForm"
import { useScmProductsStore, type ScmProduct } from "@/shared/data/scm/scm-products-store"

export default function ProductsPage() {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const deleteProduct = useScmProductsStore((s) => s.deleteProduct)

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmProduct | null>(null)

    const [viewing, setViewing] = useState<ScmProduct | null>(null)
    const [deleting, setDeleting] = useState<ScmProduct | null>(null)

    const stockStatus = (p: ScmProduct): string => {
        if (p.currentStock === 0) return "Out of Stock"
        if (p.currentStock <= p.reorderLevel) return "Low Stock"
        return "In Stock"
    }

    const formatINR = (n: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(n)

    const columns = useMemo<DataTableColumn<ScmProduct>[]>(
        () => [
            {
                key: "sku",
                header: "SKU",
                width: "120px",
                sortable: true,
                render: (r) => <span className="font-semibold text-[#0F172A]">{r.sku}</span>,
            },
            {
                key: "productName",
                header: "Product",
                sortable: true,
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.productName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">
                            {r.brand || "—"} · {r.unit}
                        </p>
                    </div>
                ),
            },
            {
                key: "category",
                header: "Category",
                sortable: true,
                width: "140px",
            },
            {
                key: "currentStock",
                header: "Stock",
                width: "120px",
                align: "right",
                sortable: true,
                accessor: (r) => r.currentStock,
                render: (r) => (
                    <div className="text-right">
                        <p className="font-semibold text-[#0F172A] tabular-nums">{r.currentStock}</p>
                        <p className="text-[11px] text-[#94A3B8]">reorder ≤ {r.reorderLevel}</p>
                    </div>
                ),
            },
            {
                key: "sellingPrice",
                header: "Price",
                width: "120px",
                align: "right",
                sortable: true,
                accessor: (r) => r.sellingPrice,
                render: (r) => (
                    <span className="font-medium text-[#0F172A] tabular-nums">
                        {formatINR(r.sellingPrice)}
                    </span>
                ),
            },
            {
                key: "warehouse",
                header: "Warehouse",
                sortable: true,
                width: "160px",
            },
            {
                key: "stockStatus",
                header: "Stock Status",
                width: "120px",
                accessor: (r) => stockStatus(r),
                render: (r) => <StatusBadge status={stockStatus(r)} />,
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

    const handleEdit = (p: ScmProduct) => {
        setEditing(p)
        setFormMode("edit")
        setFormOpen(true)
    }

    const handleExport = () => {
        if (products.length === 0) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = [
            "SKU",
            "Product Name",
            "Category",
            "Brand",
            "Unit",
            "Purchase Price",
            "Selling Price",
            "Tax Rate",
            "Reorder Level",
            "Current Stock",
            "Warehouse",
            "Status",
        ]
        const rows = products.map((p) => [
            p.sku,
            p.productName,
            p.category,
            p.brand,
            p.unit,
            p.purchasePrice,
            p.sellingPrice,
            p.taxRate,
            p.reorderLevel,
            p.currentStock,
            p.warehouse,
            p.status,
        ])
        const escape = (v: any) => {
            const s = String(v ?? "")
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `scm-products-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} products exported` })
    }

    const confirmDelete = () => {
        if (!deleting) return
        deleteProduct(deleting.id)
        toast({ title: "Product deleted", description: deleting.productName })
        setDeleting(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Products</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Manage all products and items in the inventory catalog.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]"
                    >
                        <Download className="w-4 h-4 mr-1.5" />
                        Export
                    </Button>
                    <Button
                        onClick={handleAdd}
                        className="h-9 px-3 rounded-lg text-white text-[13px]"
                        style={{
                            backgroundColor: "#2563eb",
                            boxShadow: "0 4px 12px #2563eb33",
                        }}
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Product
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={products}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by name, SKU, category..."
                searchKeys={["productName", "sku", "category", "brand", "warehouse"]}
                pageSize={10}
                emptyMessage="No products yet. Click 'Add Product' to create your first one."
                actions={(row) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-slate-100"
                                aria-label="Row actions"
                            >
                                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                onClick={() => setViewing(row)}
                                className="text-[13px] cursor-pointer"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleEdit(row)}
                                className="text-[13px] cursor-pointer"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeleting(row)}
                                className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Add / Edit slide-in form */}
            <ProductForm
                open={formOpen}
                onOpenChange={setFormOpen}
                initial={editing}
                mode={formMode}
            />

            {/* View detail (right slide) */}
            <ViewProductSheet
                product={viewing}
                onOpenChange={(o) => !o && setViewing(null)}
            />

            {/* Delete confirm */}
            <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="block">
                                You are about to delete{" "}
                                <span className="font-semibold text-[#0F172A]">
                                    {deleting?.productName}
                                </span>{" "}
                                ({deleting?.sku}). This cannot be undone.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// View-only side sheet
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"

function ViewProductSheet({
    product,
    onOpenChange,
}: {
    product: ScmProduct | null
    onOpenChange: (open: boolean) => void
}) {
    const open = !!product

    const formatINR = (n: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(n)

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={product?.productName ?? "Product"}
            description={product ? `SKU ${product.sku}` : undefined}
            icon={<Boxes className="w-5 h-5" />}
            hideFooter
            width="md"
            accentColor="#2563eb"
        >
            {product && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                    <Cell label="Category" value={product.category} />
                    <Cell label="Brand" value={product.brand || "—"} />
                    <Cell label="Unit" value={product.unit} />
                    <Cell label="Barcode" value={product.barcode || "—"} />
                    <Cell label="Warehouse" value={product.warehouse} />
                    <Cell
                        label="Status"
                        value={<StatusBadge status={product.status} />}
                    />
                    <Cell label="Purchase Price" value={formatINR(product.purchasePrice)} />
                    <Cell label="Selling Price" value={formatINR(product.sellingPrice)} />
                    <Cell label="Tax Rate" value={`${product.taxRate}%`} />
                    <Cell label="Reorder Level" value={product.reorderLevel} />
                    <Cell label="Opening Stock" value={product.openingStock} />
                    <Cell label="Current Stock" value={product.currentStock} />
                    <div className="col-span-2">
                        <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">
                            Description
                        </dt>
                        <dd className="mt-1 text-[13px] text-[#0F172A] whitespace-pre-wrap">
                            {product.description || "—"}
                        </dd>
                    </div>
                    <Cell label="Created" value={product.createdAt} />
                </dl>
            )}
        </SideFormSheet>
    )
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">
                {label}
            </dt>
            <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium">{value}</dd>
        </div>
    )
}
