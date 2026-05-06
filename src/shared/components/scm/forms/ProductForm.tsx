"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Boxes } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    useScmProductsStore,
    type ScmProduct,
    type ProductStatus,
} from "@/shared/data/scm/scm-products-store"
import { validateField } from "@/shared/components/scm/shared/validation"

const CATEGORIES = ["Stationery", "Electronics", "Packaging", "Merchandise", "Raw Material"]
const UNITS = ["Piece", "Box", "Kg", "Gram", "Litre", "Meter", "Dozen", "Carton", "Ream"]
const WAREHOUSES = ["Central Warehouse", "North Warehouse", "South Warehouse", "East Warehouse", "West Warehouse"]
const STATUSES: ProductStatus[] = ["Active", "Inactive"]

type FormShape = {
    productName: string
    sku: string
    barcode: string
    category: string
    brand: string
    unit: string
    description: string
    purchasePrice: string
    sellingPrice: string
    taxRate: string
    reorderLevel: string
    openingStock: string
    warehouse: string
    status: ProductStatus
}

const empty: FormShape = {
    productName: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    unit: "",
    description: "",
    purchasePrice: "",
    sellingPrice: "",
    taxRate: "",
    reorderLevel: "",
    openingStock: "",
    warehouse: "",
    status: "Active",
}

interface ProductFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initial?: ScmProduct | null
    mode: "create" | "edit"
}

const REQUIRED_FIELDS: Array<keyof FormShape> = [
    "productName",
    "sku",
    "category",
    "unit",
    "purchasePrice",
    "sellingPrice",
    "reorderLevel",
    "openingStock",
    "warehouse",
    "status",
]

export function ProductForm({ open, onOpenChange, initial, mode }: ProductFormProps) {
    const { toast } = useToast()
    const addProduct = useScmProductsStore((s) => s.addProduct)
    const updateProduct = useScmProductsStore((s) => s.updateProduct)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                productName: initial.productName,
                sku: initial.sku,
                barcode: initial.barcode ?? "",
                category: initial.category,
                brand: initial.brand ?? "",
                unit: initial.unit,
                description: initial.description ?? "",
                purchasePrice: String(initial.purchasePrice),
                sellingPrice: String(initial.sellingPrice),
                taxRate: String(initial.taxRate),
                reorderLevel: String(initial.reorderLevel),
                openingStock: String(initial.openingStock),
                warehouse: initial.warehouse,
                status: initial.status,
            })
        } else {
            setData(empty)
        }
        setErrors({})
        setTouched({})
    }, [open, initial, mode])

    const setField = (name: keyof FormShape, value: string) => {
        setData((d) => ({ ...d, [name]: value }))
        if (touched[name]) {
            const err = validateField(name, value)
            setErrors((e) => ({ ...e, [name]: err ?? "" }))
        }
    }

    const onBlur = (name: keyof FormShape) => {
        setTouched((t) => ({ ...t, [name]: true }))
        const err = validateField(name, data[name])
        setErrors((e) => ({ ...e, [name]: err ?? "" }))
    }

    const validateAll = (): boolean => {
        const next: Record<string, string> = {}
        const fields: Array<keyof FormShape> = [
            "productName", "sku", "barcode", "category", "brand", "unit",
            "description", "purchasePrice", "sellingPrice", "taxRate",
            "reorderLevel", "openingStock", "warehouse", "status",
        ]
        for (const f of fields) {
            const err = validateField(f, data[f])
            if (err) next[f] = err
        }
        // Required-but-empty
        for (const f of REQUIRED_FIELDS) {
            if (!next[f] && (data[f] === "" || data[f] === null || data[f] === undefined)) {
                next[f] = "This field is required"
            }
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAll()) {
            toast({
                title: "Please fix the highlighted fields",
                variant: "destructive",
            })
            return
        }
        setSubmitting(true)
        try {
            const payload = {
                productName: data.productName.trim(),
                sku: data.sku.trim().toUpperCase(),
                barcode: data.barcode.trim(),
                category: data.category,
                brand: data.brand.trim(),
                unit: data.unit,
                description: data.description.trim(),
                purchasePrice: Number(data.purchasePrice),
                sellingPrice: Number(data.sellingPrice),
                taxRate: Number(data.taxRate || 0),
                reorderLevel: Number(data.reorderLevel),
                openingStock: Number(data.openingStock),
                warehouse: data.warehouse,
                status: data.status,
            }
            if (mode === "edit" && initial) {
                updateProduct(initial.id, payload)
                toast({ title: "Product updated", description: payload.productName })
            } else {
                addProduct(payload)
                toast({ title: "Product created", description: payload.productName })
            }
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Product" : "Add Product"}
            description={
                mode === "edit"
                    ? "Update product details. Changes are saved immediately."
                    : "Create a new product in the inventory catalog."
            }
            icon={<Boxes className="w-5 h-5" />}
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create Product"}
            width="lg"
            accentColor="#2563eb"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Product Name" required error={touched.productName ? errors.productName : undefined} className="sm:col-span-2">
                    <Input
                        value={data.productName}
                        onChange={(e) => setField("productName", e.target.value)}
                        onBlur={() => onBlur("productName")}
                        placeholder="e.g. A4 Premium Copier Paper"
                        className="h-10 border-[#E5E7EB] text-[13px]"
                    />
                </Field>

                <Field label="SKU" required error={touched.sku ? errors.sku : undefined}>
                    <Input
                        value={data.sku}
                        onChange={(e) => setField("sku", e.target.value.toUpperCase())}
                        onBlur={() => onBlur("sku")}
                        placeholder="PRD-1001"
                        className="h-10 border-[#E5E7EB] text-[13px] uppercase"
                    />
                </Field>

                <Field label="Barcode" error={touched.barcode ? errors.barcode : undefined} hint="8–13 digits (optional)">
                    <Input
                        value={data.barcode}
                        onChange={(e) => setField("barcode", e.target.value.replace(/\D/g, ""))}
                        onBlur={() => onBlur("barcode")}
                        placeholder="8901234567001"
                        className="h-10 border-[#E5E7EB] text-[13px]"
                    />
                </Field>

                <Field label="Category" required error={touched.category ? errors.category : undefined}>
                    <Select
                        value={data.category}
                        onValueChange={(v) => {
                            setField("category", v)
                            setTouched((t) => ({ ...t, category: true }))
                        }}
                    >
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Brand" error={touched.brand ? errors.brand : undefined}>
                    <Input
                        value={data.brand}
                        onChange={(e) => setField("brand", e.target.value)}
                        onBlur={() => onBlur("brand")}
                        placeholder="e.g. PaperCo"
                        className="h-10 border-[#E5E7EB] text-[13px]"
                    />
                </Field>

                <Field label="Unit" required error={touched.unit ? errors.unit : undefined}>
                    <Select
                        value={data.unit}
                        onValueChange={(v) => {
                            setField("unit", v)
                            setTouched((t) => ({ ...t, unit: true }))
                        }}
                    >
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {UNITS.map((u) => (
                                <SelectItem key={u} value={u}>
                                    {u}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Warehouse" required error={touched.warehouse ? errors.warehouse : undefined}>
                    <Select
                        value={data.warehouse}
                        onValueChange={(v) => {
                            setField("warehouse", v)
                            setTouched((t) => ({ ...t, warehouse: true }))
                        }}
                    >
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]">
                            <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            {WAREHOUSES.map((w) => (
                                <SelectItem key={w} value={w}>
                                    {w}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Purchase Price" required error={touched.purchasePrice ? errors.purchasePrice : undefined} hint="₹ per unit">
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.purchasePrice}
                        onChange={(e) => setField("purchasePrice", e.target.value)}
                        onBlur={() => onBlur("purchasePrice")}
                        placeholder="0.00"
                        className="h-10 border-[#E5E7EB] text-[13px] tabular-nums"
                    />
                </Field>

                <Field label="Selling Price" required error={touched.sellingPrice ? errors.sellingPrice : undefined} hint="₹ per unit">
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.sellingPrice}
                        onChange={(e) => setField("sellingPrice", e.target.value)}
                        onBlur={() => onBlur("sellingPrice")}
                        placeholder="0.00"
                        className="h-10 border-[#E5E7EB] text-[13px] tabular-nums"
                    />
                </Field>

                <Field label="Tax Rate (%)" error={touched.taxRate ? errors.taxRate : undefined}>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.taxRate}
                        onChange={(e) => setField("taxRate", e.target.value)}
                        onBlur={() => onBlur("taxRate")}
                        placeholder="0"
                        className="h-10 border-[#E5E7EB] text-[13px] tabular-nums"
                    />
                </Field>

                <Field label="Reorder Level" required error={touched.reorderLevel ? errors.reorderLevel : undefined}>
                    <Input
                        type="number"
                        min="0"
                        step="1"
                        value={data.reorderLevel}
                        onChange={(e) => setField("reorderLevel", e.target.value)}
                        onBlur={() => onBlur("reorderLevel")}
                        placeholder="0"
                        className="h-10 border-[#E5E7EB] text-[13px] tabular-nums"
                    />
                </Field>

                <Field label="Opening Stock" required error={touched.openingStock ? errors.openingStock : undefined}>
                    <Input
                        type="number"
                        min="0"
                        step="1"
                        value={data.openingStock}
                        onChange={(e) => setField("openingStock", e.target.value)}
                        onBlur={() => onBlur("openingStock")}
                        placeholder="0"
                        className="h-10 border-[#E5E7EB] text-[13px] tabular-nums"
                    />
                </Field>

                <Field label="Status" required error={touched.status ? errors.status : undefined}>
                    <Select
                        value={data.status}
                        onValueChange={(v) => {
                            setField("status", v as ProductStatus)
                            setTouched((t) => ({ ...t, status: true }))
                        }}
                    >
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Description" error={touched.description ? errors.description : undefined} className="sm:col-span-2">
                    <Textarea
                        value={data.description}
                        onChange={(e) => setField("description", e.target.value)}
                        onBlur={() => onBlur("description")}
                        placeholder="Brief description of the product"
                        rows={3}
                        className="border-[#E5E7EB] text-[13px] resize-none"
                    />
                </Field>
            </div>
        </SideFormSheet>
    )
}
