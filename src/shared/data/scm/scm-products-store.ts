import { create } from "zustand"

export type ProductStatus = "Active" | "Inactive"

export interface ScmProduct {
    id: string
    sku: string
    productName: string
    category: string
    brand: string
    unit: string
    description: string
    purchasePrice: number
    sellingPrice: number
    taxRate: number
    reorderLevel: number
    openingStock: number
    currentStock: number
    warehouse: string
    barcode: string
    status: ProductStatus
    createdAt: string
}

interface ScmProductsState {
    products: ScmProduct[]
    addProduct: (p: Omit<ScmProduct, "id" | "createdAt" | "currentStock"> & { currentStock?: number }) => ScmProduct
    updateProduct: (id: string, patch: Partial<ScmProduct>) => void
    deleteProduct: (id: string) => void
}

const seed: ScmProduct[] = [
    {
        id: "p_1001",
        sku: "PRD-1001",
        productName: "A4 Premium Copier Paper",
        category: "Stationery",
        brand: "PaperCo",
        unit: "Ream",
        description: "80 GSM A4 sheets, 500 per ream",
        purchasePrice: 220,
        sellingPrice: 280,
        taxRate: 12,
        reorderLevel: 50,
        openingStock: 200,
        currentStock: 142,
        warehouse: "Central Warehouse",
        barcode: "8901234567001",
        status: "Active",
        createdAt: "2026-04-12",
    },
    {
        id: "p_1002",
        sku: "PRD-1002",
        productName: "Ballpoint Pen Blue",
        category: "Stationery",
        brand: "WriteWell",
        unit: "Box",
        description: "Box of 50 medium-tip blue pens",
        purchasePrice: 110,
        sellingPrice: 160,
        taxRate: 12,
        reorderLevel: 30,
        openingStock: 120,
        currentStock: 18,
        warehouse: "Central Warehouse",
        barcode: "8901234567002",
        status: "Active",
        createdAt: "2026-04-15",
    },
    {
        id: "p_1003",
        sku: "PRD-1003",
        productName: "Wireless Mouse",
        category: "Electronics",
        brand: "ClickPro",
        unit: "Piece",
        description: "2.4 GHz wireless optical mouse",
        purchasePrice: 380,
        sellingPrice: 599,
        taxRate: 18,
        reorderLevel: 25,
        openingStock: 80,
        currentStock: 64,
        warehouse: "North Warehouse",
        barcode: "8901234567003",
        status: "Active",
        createdAt: "2026-03-30",
    },
    {
        id: "p_1004",
        sku: "PRD-1004",
        productName: "Cardboard Carton 12x10x8",
        category: "Packaging",
        brand: "BoxIt",
        unit: "Piece",
        description: "Corrugated 3-ply shipping carton",
        purchasePrice: 22,
        sellingPrice: 35,
        taxRate: 18,
        reorderLevel: 200,
        openingStock: 1000,
        currentStock: 0,
        warehouse: "South Warehouse",
        barcode: "8901234567004",
        status: "Inactive",
        createdAt: "2026-02-18",
    },
    {
        id: "p_1005",
        sku: "PRD-1005",
        productName: "Stainless Steel Bottle 750ml",
        category: "Merchandise",
        brand: "HydroX",
        unit: "Piece",
        description: "Insulated stainless steel water bottle",
        purchasePrice: 240,
        sellingPrice: 449,
        taxRate: 18,
        reorderLevel: 40,
        openingStock: 150,
        currentStock: 92,
        warehouse: "Central Warehouse",
        barcode: "8901234567005",
        status: "Active",
        createdAt: "2026-04-22",
    },
]

const nextId = () => "p_" + Math.random().toString(36).slice(2, 10)

export const useScmProductsStore = create<ScmProductsState>((set) => ({
    products: seed,
    addProduct: (p) => {
        const product: ScmProduct = {
            id: nextId(),
            createdAt: new Date().toISOString().slice(0, 10),
            currentStock: p.currentStock ?? p.openingStock ?? 0,
            ...p,
        } as ScmProduct
        set((s) => ({ products: [product, ...s.products] }))
        return product
    },
    updateProduct: (id, patch) =>
        set((s) => ({
            products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
    deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
}))
